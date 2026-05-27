import config from './config'
import { chmodSync, existsSync, unlinkSync } from 'fs'
import { Server } from 'socket.io'
import { createServer } from 'http'
import SocketController from './socket-io'
import {
	BaseGuildTextChannel,
	Client,
	GatewayIntentBits,
	WebhookClient
} from 'discord.js'
import parseMessage from './parse'

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.MessageContent
	]
})

export async function main() {
	console.info('Setting up server');
	// Initialize Discord client
	await client.login(config.token)
	await new Promise(resolve => client.once('clientReady', resolve))
	const guild = await client.guilds.fetch(config.server);
	const channel = await guild.channels.fetch(config.channel);
	if (!channel) {
		throw new Error(`Could not find channel ${config.channel} in server ${config.server}`);
	}
	if (!channel.isTextBased()) {
		throw new Error(`Channel ${config.channel} in server ${config.server} is not text based`);
	}
	const webhook = new WebhookClient({
		url: config.webhook
	})

	// Initialize socket.io server
	const httpServer = createServer()
	const io = new Server(httpServer, {
		path: '/',
		serveClient: false,
		transports: ['websocket']
	});
	io.on('connection', socket => new SocketController(socket, channel as BaseGuildTextChannel, webhook))

	client.on('messageCreate', async message =>
		message.channelId === config.channel &&
		io.emit('message', {
			message: await parseMessage(message)
		}));

	client.on('messageUpdate', async (_, newMessage) =>
		newMessage.channelId === config.channel &&
		io.emit('messageUpdate', {
			message: await parseMessage(newMessage)
		}))

	client.on('messageDelete', message =>
		message.channelId === config.channel &&
		io.emit('messageDelete', {
			id: message.id
		}))

	client.on('messageDeleteBulk', messages =>
		messages.first()?.channelId === config.channel &&
		io.emit('messageDeleteBulk', {
			ids: messages.map(message => message.id)
		}))

	client.on('messageReactionAdd', ({ message, emoji, count }) => 
		message.channelId === config.channel &&
		io.emit('messageReactionAdd', {
			id: message.id,
			reaction: {
				name: emoji.name,
				id: emoji.id,
				count: count
			}
		}))

	client.on('messageReactionRemove', ({ message, emoji, count }) => 
		message.channelId === config.channel &&
		io.emit('messageReactionRemove', {
			id: message.id,
			reaction: {
				name: emoji.name,
				id: emoji.id,
				count: count
			}
		}))

	// Start server
	if (config.unixSocket && existsSync(config.unixSocket)) {
		unlinkSync(config.unixSocket)
	}
	console.info('Server starting');
	httpServer.listen(config.unixSocket ?? config.port, async () => {
		if (config.unixSocket) {
			chmodSync(config.unixSocket!, 0o777);
		}
		console.info('Server started');
	});
}

main();
