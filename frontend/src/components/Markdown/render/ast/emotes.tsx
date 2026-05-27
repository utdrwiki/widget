import { Emoji, Twemoji } from '../elements'
import * as React from 'react'
import SimpleMarkdown from 'simple-markdown'

const getEmoteURL = emote => `https://cdn.discordapp.com/emojis/${emote.id}.png`
const getAnimEmoteURL = emote =>
  `https://cdn.discordapp.com/emojis/${emote.id}.gif`

export const emoji = {
  order: SimpleMarkdown.defaultRules.text.order,
  match: source => /^:([^\s:]+?):/.exec(source),
  parse: ([content]) => ({ content }),
  react: (node, recurseOutput, state) => (
    <Twemoji resolveNames={true} key={state.key}>
      {node.content}
    </Twemoji>
  )
}

export const customEmoji = {
  order: SimpleMarkdown.defaultRules.text.order,
  match: source => /^<:(\w+):(\d+)>/.exec(source),
  parse: ([, name, id]) => ({
    emojiId: id,
    name,
    src: getEmoteURL({ id })
  }),
  react: node => (
    <Emoji
      enlarged={node.jumboable}
      alt={`<:${node.name}:${node.emojiId}>`}
      src={node.src}
    />
  )
}

export const animatedEmoji = {
  order: SimpleMarkdown.defaultRules.text.order,
  match: source => /^<a:(\w+):(\d+)>/.exec(source),
  parse: ([, name, id]) => ({
    emojiId: id,
    name,
    src: getAnimEmoteURL({ id })
  }),
  react: node => (
    <Emoji
      draggable={false}
      enlarged={node.jumboable}
      alt={`<:${node.name}:${node.emojiId}>`}
      src={node.src}
    />
  )
}
