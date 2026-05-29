import io from 'socket.io';
import { Notification } from 'react-notification-system';
import config from './config';
import parseMessage from './parse';
import crypto from 'crypto';
import { APIMessageTopLevelComponent, BaseGuildTextChannel, ButtonStyle, ComponentType, WebhookClient } from 'discord.js';
import { getUserFeedback, getUserInfo, LastEditInfo } from './mediawiki';
import { addUser, addUserMessage, isIpBanned, removeSocket } from './users';

const randomAvatar = (username: string) => `https://www.gravatar.com/avatar/${
	encodeURIComponent(
		crypto
			.createHash('md5')
			.update(username)
			.digest('hex')
	)}?s=400&d=identicon`;

const acknowledgedFeedback = new Set<number>();

class SocketController {
	private socket: io.Socket
	private channel: BaseGuildTextChannel
	private webhook: WebhookClient
	private ip: string
	private wiki: string
	private userId?: number
	private name?: string
	private avatar?: string

	constructor(socket: io.Socket, channel: BaseGuildTextChannel, webhook: WebhookClient) {
		this.socket = socket
		socket.on('disconnect', this.handleDisconnect.bind(this));
		this.channel = channel;
		this.webhook = webhook;
		const forwardedFor = socket.handshake.headers['x-forwarded-for'];
		const wikiHeader = socket.handshake.headers['x-wiki-id'];
		if (typeof forwardedFor !== 'string' || typeof wikiHeader !== 'string' || !(wikiHeader in config.wikis)) {
			throw new Error('User connected without required headers', {
				cause: {
					ip: socket.conn.remoteAddress,
					forwardedFor,
					wikiHeader
				}
			});
		}
		this.ip = forwardedFor.split(',', 1).join(',').trim();
		this.wiki = wikiHeader;
		if (isIpBanned(this.ip)) {
			console.info('Banned user attempted to connect', {
				ip: this.ip,
				wiki: this.wiki
			});
			removeSocket(this);
			return;
		}
		const cookieHeader = socket.handshake.headers['cookie'];
		console.info('User connected', {
			ip: this.ip,
			wiki: this.wiki,
			cookieHeader
		});
		const cookies = Array.isArray(cookieHeader) ?
			cookieHeader.join(';') :
			cookieHeader || '';
		this.init(cookies);
	}

	private notify(notification: Notification) {
		this.socket.emit('notify', notification)
	}

	private async init(cookies: string) {
		try {
			const userInfo = await getUserInfo(cookies, this.wiki);
			this.userId = userInfo.id;
			this.name = userInfo.name;
			this.avatar = randomAvatar(userInfo.name);
			addUser(this, this.name, this.ip);
			await Promise.allSettled([
				this.startUserSession(),
				this.relayUserFeedback(userInfo.changed)
			]);
		} catch (error) {
			console.error('Failed to fetch user info', {
				error,
				ip: this.ip,
				wiki: this.wiki
			});
			this.notify({
				level: 'error',
				title: 'No active wiki session',
				message: 'You do not seem to have any active wiki session. If you had just left article feedback, this is a bug. Sorry!'
			});
			this.socket.disconnect(true);
			return;
		}
	}

	private async startUserSession() {
		try {
			const messages = (await Promise.all(Array
				.from(this.channel.messages.cache.values())
				.sort((a, b) => a.createdTimestamp - b.createdTimestamp)
				.slice(-100)
				.map(message => parseMessage(message))));
			this.socket.on('sendMessage', this.handleMessage.bind(this));
			this.socket.on('typing', this.handleTyping.bind(this));
			this.socket.emit('signIn', {
				channel: this.channel,
				messages,
				name: this.name
			});
		} catch (error) {
			console.error('Failed to start user session', {
				error,
				ip: this.ip,
				wiki: this.wiki
			});
			this.notify({
				level: 'error',
				title: 'Failed to load messages',
				message: 'An error occurred while loading messages. Please try again.'
			});
			this.socket.disconnect(true);
		}
	}

	private async relayUserFeedback(changed?: LastEditInfo) {
		if (!changed) {
			console.warn('User joined without any recent feedback', {
				userId: this.userId,
				ip: this.ip,
			});
			return;
		}
		if (acknowledgedFeedback.has(changed.torev)) {
			return;
		}
		acknowledgedFeedback.add(changed.torev);
		try {
			const feedback = await getUserFeedback(changed, this.wiki);
			const diffLink = changed.fromrev === 0 ?
				'' :
				` ([diff](<${feedback.diffUrl}>))`;
			await this.sendWebhook(
				`Feedback on [${feedback.title}](<${feedback.articleUrl}>)${diffLink}:\n\n>>> ${feedback.content}`,
				[{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button,
							label: 'Ban',
							custom_id: this.name!,
							style: ButtonStyle.Danger
						}
					]
				}]
			);
		} catch (error) {
			console.error('Failed to send feedback:', error);
			this.notify({
				level: 'warning',
				title: 'Error sending feedback',
				message: 'Your feedback was successfully recorded on the wiki, but there was an error sending it to Discord. Sorry!'
			});
		}
	}

	private async handleTyping() {
		try {
			await this.channel.sendTyping();
		} catch (e) {
			// Bad perms
		}
	}

	private async handleMessage(data: unknown) {
		if (typeof data !== 'object' || !data || !('message' in data) || typeof data.message !== 'string') {
			this.notify({
				level: 'error',
				title: 'Invalid message',
				message: 'Please provide a valid message.'
			});
			return;
		}
		try {
			await this.sendWebhook(data.message);
		} catch (error) {
			console.error('Failed to send message:', error)
			this.notify({
				level: 'error',
				title: 'Failed to send message',
				message: 'An error occurred while sending your message! Please try again.'
			})
		}
	}

	private handleDisconnect(reason: io.DisconnectReason) {
		console.info('User disconnected', {
			ip: this.ip,
			userId: this.userId,
			reason
		});
		removeSocket(this, this.name);
	}

	private async sendWebhook(content: string, components: APIMessageTopLevelComponent[] = []): Promise<void> {
		if (!this.name) {
			return;
		}
		const message = await this.webhook.send({
			allowedMentions: { parse: [] },
			content: content.slice(0, 2000),
			components,
			withComponents: components.length > 0,
			username: this.name.slice(0, 80),
			avatarURL: this.avatar
		});
		addUserMessage(this.name, message.id);
	}

	public disconnect() {
		if (this.socket.connected) {
			this.socket.disconnect(true);
		}
	}
}

export default SocketController
