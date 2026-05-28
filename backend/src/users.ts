import SocketController from './socket-io';

interface User {
	sockets: SocketController[];
	messages: string[];
	ips: Set<string>;
}

const sockets: SocketController[] = [];
const users: Record<string, User> = {};
const bannedIps = new Set<string>();

export function addSocket(socket: SocketController) {
	sockets.push(socket);
}

export function removeSocket(socket: SocketController, name?: string) {
	const index = sockets.indexOf(socket);
	if (index !== -1) {
		sockets.splice(index, 1);
	}
	if (name) {
		const user = users[name];
		if (user) {
			const socketIndex = user.sockets.indexOf(socket);
			if (socketIndex !== -1) {
				user.sockets.splice(socketIndex, 1);
				if (user.sockets.length === 0) {
					delete users[name];
				}
			}
		}
	}
	socket.disconnect();
}

export function addUser(socket: SocketController, name: string, ip: string) {
	if (users[name]) {
		users[name].sockets.push(socket);
		users[name].ips.add(ip);
	} else {
		users[name] = {
			sockets: [socket],
			messages: [],
			ips: new Set<string>([ip])
		};
	}
}

export function addUserMessage(name: string, message: string) {
	const user = users[name];
	if (user) {
		user.messages.push(message);
	}
}

export function banUser(name: string): string[] {
	const user = users[name];
	if (!user) {
		return [];
	}
	delete users[name];
	console.info('Banning user', name, user);
	for (const socket of user.sockets) {
		socket.disconnect();
	}
	for (const ip of user.ips) {
		bannedIps.add(ip);
	}
	return user.messages;
}

export function isIpBanned(ip: string): boolean {
	return bannedIps.has(ip);
}
