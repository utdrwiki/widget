import { Embed as DiscordEmbed } from 'discord.js'

interface EmbedAuthor {
	name?: string
	url?: string
	iconURL?: string
	proxyIconURL?: string
}

interface EmbedField {
	value?: string
	name?: string
	inline?: Boolean
}

interface EmbedFooter {
	iconURL?: string
	proxyIconUrl?: string
	text?: string
}

interface EmbedThumbnail {
	height?: number
	width?: number
	proxyURL?: string
	url?: string
}

interface EmbedImage {
	height?: number
	width?: number
	proxyURL?: string
	url?: string
}

interface EmbedProvider {
	name?: string
	url?: string
}

interface EmbedVideo {
	height?: number
	width?: number
	url?: string
}

class Embed {
	color?: number
	fields?: EmbedField[]
	footer?: EmbedFooter
	thumbnail?: EmbedThumbnail
	author?: EmbedAuthor
	image?: EmbedImage
	provider?: EmbedProvider
	video?: EmbedVideo
	title?: string
	description?: string
	url?: string
	timestamp?: number
	type?: string

	constructor(embed: DiscordEmbed) {
		if (!embed || !embed.data) return

		this.title = embed.data.title ?? undefined
		this.description = embed.data.description ?? undefined
		this.url = embed.data.url ?? undefined
		this.timestamp = embed.data.timestamp ? new Date(embed.data.timestamp).getTime() : undefined
		this.color = embed.data.color ?? undefined
		this.type = embed.data.type ?? undefined

		if (embed.data.fields) {
			this.fields = embed.data.fields.map(f => ({
				name: f.name,
				value: f.value,
				inline: !!f.inline
			}))
		}

		if (embed.data.footer) {
			this.footer = {
				text: embed.data.footer.text ?? undefined,
				iconURL: embed.data.footer.icon_url ?? undefined,
				proxyIconUrl: embed.data.footer.proxy_icon_url ?? undefined
			}
		}

		if (embed.data.thumbnail) {
			this.thumbnail = {
				url: embed.data.thumbnail.url ?? undefined,
				proxyURL: embed.data.thumbnail.proxy_url ?? undefined,
				height: embed.data.thumbnail.height ?? undefined,
				width: embed.data.thumbnail.width ?? undefined
			}
		}

		if (embed.data.image) {
			this.image = {
				url: embed.data.image.url ?? undefined,
				proxyURL: embed.data.image.proxy_url ?? undefined,
				height: embed.data.image.height ?? undefined,
				width: embed.data.image.width ?? undefined
			}
		}

		if (embed.data.author) {
			this.author = {
				name: embed.data.author.name ?? undefined,
				url: embed.data.author.url ?? undefined,
				iconURL: embed.data.author.icon_url ?? undefined,
				proxyIconURL: embed.data.author.proxy_icon_url ?? undefined
			}
		}

		if (embed.data.provider) {
			this.provider = {
				name: embed.data.provider.name ?? undefined,
				url: embed.data.provider.url ?? undefined
			}
		}

		if (embed.data.video) {
			this.video = {
				url: embed.data.video.url ?? undefined,
				height: embed.data.video.height ?? undefined,
				width: embed.data.video.width ?? undefined
			}
		}
	}
}

export default Embed
