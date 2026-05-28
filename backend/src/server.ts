import config from './config';
import { chmodSync, existsSync, unlinkSync } from 'fs';
import { Server } from 'socket.io';
import { createServer } from 'http';
import SocketController from './socket-io';
import { Events } from 'discord.js';
import parseMessage from './parse';
import { addSocket } from './users';
import { setup } from './discord';

export async function main() {
	console.info('Setting up server');
	const [client, webhook, channel] = await setup();
	const httpServer = createServer()
	const io = new Server(httpServer, {
		path: '/',
		serveClient: false,
		transports: ['websocket']
	});

	io.on('connection', socket => addSocket(new SocketController(
		socket,
		channel,
		webhook,
	)));

	client.on(Events.MessageCreate, async message =>
		message.channelId === config.channel &&
		io.emit('message', {
			message: await parseMessage(message)
		}));

	client.on(Events.MessageUpdate, async (_, newMessage) =>
		newMessage.channelId === config.channel &&
		io.emit('messageUpdate', {
			message: await parseMessage(newMessage)
		}))

	client.on(Events.MessageDelete, message =>
		message.channelId === config.channel &&
		io.emit('messageDelete', {
			id: message.id
		}))

	client.on(Events.MessageBulkDelete, messages =>
		messages.first()?.channelId === config.channel &&
		io.emit('messageDeleteBulk', {
			ids: messages.map(message => message.id)
		}))

	client.on(Events.MessageReactionAdd, ({ message, emoji, count }) => 
		message.channelId === config.channel &&
		io.emit('messageReactionAdd', {
			id: message.id,
			reaction: {
				name: emoji.name,
				id: emoji.id,
				count: count
			}
		}));

	client.on(Events.MessageReactionRemove, ({ message, emoji, count }) => 
		message.channelId === config.channel &&
		io.emit('messageReactionRemove', {
			id: message.id,
			reaction: {
				name: emoji.name,
				id: emoji.id,
				count: count
			}
		}));

	// Start server
	if (config.unixSocket && existsSync(config.unixSocket)) {
		unlinkSync(config.unixSocket);
	}
	console.info('Server starting');
	httpServer.listen(config.unixSocket ?? config.port, () => {
		if (config.unixSocket) {
			chmodSync(config.unixSocket!, 0o777);
		}
		console.info('Server started');
	});
}

main();
