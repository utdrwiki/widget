import { BaseGuildTextChannel, Client } from 'discord.js';
import config from './config';

async function main() {
	const client = new Client({ intents: [] });
	await client.login(config.token);
	const guild = await client.guilds.fetch(config.server);
	const channel = await guild.channels.fetch(config.channel);
	if (!channel?.isTextBased()) {
		throw new Error('Configured channel is not a text channel');
	}
	const webhook = await (<BaseGuildTextChannel>channel).createWebhook({
		name: 'widget'
	});
	console.info(webhook.url);
	await client.destroy();
}

main();
