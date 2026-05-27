import * as _ from 'lodash'
import text from './text'
import SimpleMarkdown from 'simple-markdown'

import { animatedEmoji, customEmoji, emoji } from './emotes'

const baseRules = {
  ..._.pick(SimpleMarkdown.defaultRules, [
    'newline',
    'paragraph',
    'escape',
    'link',
    'url',
    'strong',
    'em',
    'u',
    'br',
    'inlineCode'
  ]),

  autolink: {
    ...SimpleMarkdown.defaultRules.autolink,
    match: SimpleMarkdown.inlineRegex(/^<(https?:\/\/[^ >]+)>/)
  },
  emoticon: {
    order: SimpleMarkdown.defaultRules.text.order,
    match: source => /^(¯\\_\(ツ\)_\/¯)/.exec(source),
    parse: capture => ({ type: 'text', content: capture[1] })
  },
  codeBlock: {
    order: SimpleMarkdown.defaultRules.codeBlock.order,
    match: source => /^```(([A-z0-9-]+?)\n+)?\n*([^]+?)\n*```/.exec(source),
    parse: ([, , lang, content]) => ({
      lang: (lang || '').trim(),
      content: content || ''
    })
  },
  emoji,
  customEmoji,
  animatedEmoji,
  text,

  s: {
    order: SimpleMarkdown.defaultRules.u.order,
    match: SimpleMarkdown.inlineRegex(/^~~([\s\S]+?)~~(?!_)/),
    parse: SimpleMarkdown.defaultRules.u.parse
  }
}

export default baseRules
