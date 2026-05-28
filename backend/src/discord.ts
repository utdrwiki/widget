import { ApplicationCommandOptionType, BaseGuildTextChannel, Client, Events, GatewayIntentBits, Interaction, WebhookClient } from "discord.js";
import config from "./config";
import { banUser } from "./users";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.MessageContent
	]
});

let globalChannel: BaseGuildTextChannel | null = null;

async function handleInteraction(interaction: Interaction) {
	try {
		const roles = interaction.member?.roles;
		if (
			!roles ||
			(
				Array.isArray(roles) &&
				!roles.includes(config.modRole)
			) ||
			(
				!Array.isArray(roles) &&
				!roles.cache.has(config.modRole)
			)
		) {
			if ('reply' in interaction) {
				await interaction.reply({
					content: 'You do not have permission to use this command.',
					ephemeral: true
				});
			}
			return;
		}
		let messagesToDelete: string[] = [];
		if (interaction.isChatInputCommand() && interaction.commandName === 'ban') {
			const userToBan = interaction.options.getString('user');
			messagesToDelete = banUser(userToBan!);
			await interaction.reply({
				content: 'Banned.',
				ephemeral: true
			});
		} else if (interaction.isButton()) {
			messagesToDelete = banUser(interaction.customId);
			await interaction.reply({
				content: 'Banned.',
				ephemeral: true
			});
		}
		if (messagesToDelete.length > 0) {
			await globalChannel?.bulkDelete(messagesToDelete, true);
		}
	} catch (error) {
		console.error('Error occurred while handling interaction', error);
	}
}

export async function setup(): Promise<[Client, WebhookClient, BaseGuildTextChannel]> {
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
	globalChannel = <BaseGuildTextChannel>channel;
	if (!client.application) {
		throw new Error('Client application is not available');
	}
	await channel.messages.fetch({
		limit: 100
	});
	const webhook = new WebhookClient({
		url: config.webhook
	});
	await client.application.commands.create({
		name: 'ban',
		description: 'Ban a widget user',
		options: [{
			name: 'user',
			description: 'The user to ban (wiki username)',
			type: ApplicationCommandOptionType.String,
			required: true,
		}],
	}, config.server);
	client.on(Events.InteractionCreate, handleInteraction);
	return [client, webhook, globalChannel];
}
