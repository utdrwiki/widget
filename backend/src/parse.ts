import { Message as DiscordMessage, GuildMember, User } from 'discord.js'
import Embed from './embed'
import { PermissionsBitField } from 'discord.js'

export interface Channel {
	name: string
	topic: string
	type: number
	id: string
	category: string
	permissions: PermissionsBitField
}

export interface Reaction {
	id: string
	name: string
	count: number
}

export interface Role {
	color: string
	position: number
	name: string
}

export interface Author {
	name: string
	type: 'bot' | 'guest' | 'member'
	avatar: string | null
	id: string
	color: string
	roles: Role[] | null
}

export interface Attachment {
	url: string
	height: number
	width: number
}

interface Message {
	id: string
	reference?: string
	author: Author
	timestamp: number
	content: string | null
	embeds: Embed[]
	editedAt: number | null
	type: number
	reactions: Reaction[]
	attachment?: Attachment
	mentions: {
		channels: {
			name: string
			id: string
		}[]
		members: {
			name: string
			id: string
			roles: Role[] | null
			avatar: string
		}[]
		roles: {
			name: string
			color: string
			id: string
		}[]
		everyone: boolean
	}
}

async function getMember(message: DiscordMessage<true>, user: User): Promise<GuildMember | null> {
	if (message.webhookId) {
		return null;
	}
	if (message.guild.members.cache.has(user.id)) {
		return message.guild.members.cache.get(user.id)!;
	}
	try {
		return await message.guild.members.fetch(user.id);
	} catch {
		return null;
	}
}

export default async function(message: DiscordMessage): Promise<Message> {
	if (!message.inGuild()) {
		throw new Error('Message does not have a guild, cannot parse')
	}
	const member = message.member ?? await getMember(message, message.author);
	return {
		id: message.id,
		reference: message.reference?.messageId,
		author: {
			name: member?.displayName ?? message.author.globalName ?? message.author.tag,
			type: message.webhookId ? 'guest' : message.author.bot ? 'bot' : 'member',
			avatar: message.author.displayAvatarURL({ size: 64 }),
			id: message.author.id,
			color: member?.displayHexColor ?? '#000000',
			roles: Array.from(member?.roles.cache.values() ?? [])
				.map(role => ({
					name: role.name,
					color: role.hexColor,
					position: role.rawPosition
				})) ?? []
		},
		timestamp: message.createdTimestamp,
		content: message.content || null,
		embeds: message.embeds.map(embed => new Embed(embed)) || [],
		editedAt: message.editedTimestamp === 0 ? null : message.editedTimestamp,
		type: message.type,
		reactions: Array.from(message.reactions.cache.values())
			.map(reaction => ({
				name: reaction.emoji.name ?? '',
				id: reaction.emoji.id ?? '',
				count: reaction.count
			})),
		attachment: message.attachments.mapValues(attachment => ({
			width: attachment.width ?? 0,
			height: attachment.height ?? 0,
			url: attachment.url
		})).first(),
		mentions: {
			channels: message.mentions.channels.map(channel => ({
				name: channel.isDMBased() ? 'unknown' : channel.name,
				id: channel.id
			})),
			members: await Promise.all(
				[...message.mentions.users.values()].map(async user => {
					const member = await getMember(message, user);
					if (member) {
						return {
							name: member.displayName,
							id: member.id,
							roles: Array.from(member.roles.cache.values())
								.map(role => ({
									name: role.name,
									color: role.hexColor,
									position: role.rawPosition
								})),
							avatar: member.user.displayAvatarURL({ size: 128 })
						}
					} else {
						return {
							name: user.globalName || user.username,
							id: user.id,
							roles: [],
							avatar: user.displayAvatarURL({ size: 128 })
						}
					}
				})
			),
			roles: Array.from(message.mentions.roles.values())
				.map(role => ({
					name: role.name,
					color: role.hexColor,
					position: role.position,
					id: role.id
				})),
			everyone: message.mentions.everyone
		}
	}
}
