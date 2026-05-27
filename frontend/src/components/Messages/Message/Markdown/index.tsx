import hljs from 'highlight.js'
import Moment from 'moment'
import * as React from 'react'
import SimpleMarkdown from 'simple-markdown'
import { iterate } from '../../../../modules/styled-elements/Emoji/emojiMap'
import message from '../../../../types/message'
import Embed from '../Embed'
import { Channel, Code, Edited, Emoji, Image, Link, Mention, Role, Timestamp, Twemoji } from './elements'

export function parseText(msg: message) {
  function mentions(array: [string | string[]], mentions) {
    return array.map(e => {
      if (typeof e !== 'string') {
        return e
      }

      mentions.members.forEach((member, i) => {
        const roles = member.roles.sort((a, b) => (a.position < b.position ? 1 : -1))
        let color
        for (let role of roles) {
          if (role.color !== '#000000') {
            color = role.color
            break
          }
        }

        e = replace(
          e,
          new RegExp(`<@!*${member.id}>`, 'g'),
          <Mention
            key={member.id}
            color={color}
            // onClick={() => props.setUserPopup(member)}
          >
            {`@${member.name}`}
          </Mention>
        )
      })

      mentions.roles.forEach((role, i) => {
        e = replace(e, `<@&${role.id}>`, <Role role={role} key={role.id} color={role.color}>{`@${role.name}`}</Role>)
      })

      let _e: string[] | string = e as string[] | string
      if (_e instanceof Array) {
        _e.map(a => {
          return typeof a === 'string' ? a.replace(/<@&[0-9]{18}>/g, '@deleted-role') : a
        })
      } else {
        e = e.replace(/<@&[0-9]{18}>/g, '@deleted-role')
      }

      if (mentions.everyone) {
        e = replace(
          e,
          '@everyone',
          <Role key={Math.random()} everyone>
            {`@everyone`}
          </Role>
        )
        e = replace(
          e,
          '@here',
          <Role key={Math.random()} everyone>
            {`@here`}
          </Role>
        )
      }

      return e
    })
  }

  function replace(string, regex, element) {
    if (string instanceof Array) {
      return string.map(e => replace(e, regex, element))
    } else if (typeof string === 'string') {
      const parts = string.split(regex)

      for (var i = 1; i < parts.length; i += 2) {
        parts.splice(i, 0, element)
      }

      return parts
    }
    return string
  }

  function attachment(msg, setPopup?) {
    return msg.attachment ? <Image src={msg.attachment.url} height={+msg.attachment.height} width={+msg.attachment.width} /> : null
  }

  function embed(msg: message) {
    if (msg.embeds.length === 0) return null

    //TODO: Check GIFs
    return msg.embeds.map((embed, i) => {
      if (embed.image.url.endsWith('.gif')) {
        return <Image src={embed.video.url.replace('.mp4', '.gif')} width={+embed.video.width} height={+embed.video.height} key={i} />
      }
      return <Embed key={i} {...embed} />
    })
  }

  function emoji(input) {
    return input.map((part, i) => {
      if (typeof part === 'string') {
        return <Twemoji resolveNames onlyEmojiClassName="enlarged" text={part} key={i * Math.random()} />
      }
      return part
    })
  }

  return (
    <React.Fragment>
      {msg.content && emoji(mentions(parseAllowLinks(msg.content), msg.mentions))}
      {msg.editedAt && <Edited className="edited">{`(edited)`}</Edited>}
      {attachment(msg)}
      {embed(msg)}
    </React.Fragment>
  )
}
// this is mostly translated from discord's client,
// although it's not 1:1 since the client js is minified
// and also is transformed into some tricky code

// names are weird and sometimes missing, as i'm not sure
// what all of these are doing exactly.

const emojiTipOptions = {
  'data-type': 'dark',
  'data-effect': 'solid',
  'data-delay-show': 450,
  'data-place': 'top',
  'data-offset': "{ 'top': 3 }"
}

// this function seems to be duplicated quite a bit in the original source...
function createReactElement(type, props, key?, ...children) {
  const defaultProps = type && type.defaultProps

  if (props && defaultProps) {
    for (const prop in defaultProps) {
      if (props[prop] === undefined) {
        props[prop] = defaultProps[prop]
      }
    }
  } else if (!props) {
    props = defaultProps || {}
  }

  props.children = children[0]
  if (children.length > 1) {
    props.children = children
  }

  return {
    $$typeof: Symbol.for('react.element'),
    type: type,
    key: key == null ? null : `${key}`,
    ref: null,
    props: props,
    _owner: null
  }
}

function flattenAst(node, parent?) {
  if (Array.isArray(node)) {
    for (let n = 0; n < node.length; n++) {
      node[n] = flattenAst(node[n], parent)
    }

    return node
  }

  if (node.content != null) {
    node.content = flattenAst(node.content, node)
  }

  if (parent != null && node.type === parent.type) {
    return node.content
  }

  return node
}

function astToString(node) {
  function inner(node, result = []) {
    if (Array.isArray(node)) {
      node.forEach(subNode => astToString(subNode))
    } else if (typeof node.content === 'string') {
      result.push(node.content)
    } else if (node.content != null) {
      astToString(node.content)
    }

    return result
  }

  return inner(node).join('')
}

function recurse(node, recurseOutput, state) {
  if (typeof node.content === 'string') {
    return node.content
  }

  return recurseOutput(node.content, state)
}

function parserFor(rules, returnAst?) {
  const parser = SimpleMarkdown.parserFor(rules)
  const renderer = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, 'react'))
  return function(input = '', inline = true, state = {}, transform = null) {
    if (!inline) {
      input += '\n\n'
    }

    let ast = parser(input, { inline, ...state })
    ast = flattenAst(ast)
    if (transform) {
      ast = transform(ast)
    }

    if (returnAst) {
      return ast
    }

    return renderer(ast)
  }
}

function omit(object, excluded) {
  return Object.keys(object).reduce((result, key) => {
    if (excluded.indexOf(key) === -1) {
      result[key] = object[key]
    }

    return result
  }, {})
}

// emoji stuff

const getEmoteURL = emote => `https://cdn.discordapp.com/emojis/${emote.id}.png`
const getAnimEmoteURL = emote => `https://cdn.discordapp.com/emojis/${emote.id}.gif`

function getEmojiURL(surrogate) {
  if (['™', '©', '®'].indexOf(surrogate) > -1) {
    return ''
  }

  try {
    // we could link to discord's cdn, but there's a lot of these
    // and i'd like to minimize the amount of data we need directly from them
    return `https://twemoji.maxcdn.com/2/svg/aaa.svg`
  } catch (error) {
    return ''
  }
}

// emoji lookup tables

const DIVERSITY_SURROGATES = ['🏻', '🏼', '🏽', '🏾', '🏿']
const NAME_TO_EMOJI = {}
const EMOJI_TO_NAME = {}

iterate(({ keywords, emoji }) => {
  EMOJI_TO_NAME[emoji] = keywords[0] || ''
  keywords.forEach(keyword => {
    NAME_TO_EMOJI[keyword] = emoji

    DIVERSITY_SURROGATES.forEach((d, i) => {
      NAME_TO_EMOJI[`${name}::skin-tone-${i + 1}`] = emoji.concat(d)
    })
  })
  DIVERSITY_SURROGATES.forEach((d, i) => {
    const surrogates = emoji.concat(d)
    const name = keywords[0] || ''

    EMOJI_TO_NAME[surrogates] = `${name}::skin-tone-${i + 1}`
  })
})

const EMOJI_NAME_AND_DIVERSITY_RE = /^:([^\s:]+?(?:::skin-tone-\d)?):/

function convertNameToSurrogate(name, t = '') {
  // what is t for?
  return NAME_TO_EMOJI.hasOwnProperty(name) ? NAME_TO_EMOJI[name] : t
}

function convertSurrogateToName(surrogate, colons = true, n = '') {
  // what is n for?
  let a = n

  if (EMOJI_TO_NAME.hasOwnProperty(surrogate)) {
    a = EMOJI_TO_NAME[surrogate]
  }

  return colons ? `:${a}:` : a
}

const escape = str => str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')

const replacer = (function() {
  const surrogates = Object.keys(EMOJI_TO_NAME)
    .sort(surrogate => -surrogate.length)
    .map(surrogate => escape(surrogate))
    .join('|')

  return new RegExp('(' + surrogates + ')', 'g')
})()

function translateSurrogatesToInlineEmoji(surrogates) {
  return surrogates.replace(replacer, (_, match) => convertSurrogateToName(match))
}

function formatTimestamp(unixSeconds: number, style: string): string {
  const m = Moment(unixSeconds * 1000)
  switch (style) {
    case 't': return m.format('LT')
    case 'T': return m.format('LTS')
    case 'd': return m.format('L')
    case 'D': return m.format('LL')
    case 'f': return m.format('LLL')
    case 'F': return m.format('LLLL')
    case 'R': return m.fromNow()
    default: return m.format('LLL')
  }
}

function getFullTimestamp(unixSeconds: number): string {
  return Moment(unixSeconds * 1000).format('LLLL')
}

// i am not sure why are these rules split like this.

const baseRules = {
  timestamp: {
    order: SimpleMarkdown.defaultRules.text.order - 1,
    match(source) {
      return /^<t:(-?\d+)(?::([tTdDfFR]))?>/.exec(source)
    },
    parse(capture) {
      return {
        timestamp: parseInt(capture[1], 10),
        style: capture[2] || 'f'
      }
    },
    react(node, recurseOutput, state) {
      return createReactElement(
        Timestamp,
        {
          title: getFullTimestamp(node.timestamp)
        },
        state.key,
        formatTimestamp(node.timestamp, node.style)
      )
    }
  },
  newline: SimpleMarkdown.defaultRules.newline,
  paragraph: SimpleMarkdown.defaultRules.paragraph,
  escape: SimpleMarkdown.defaultRules.escape,
  link: SimpleMarkdown.defaultRules.link,
  autolink: {
    ...SimpleMarkdown.defaultRules.autolink,
    match: SimpleMarkdown.inlineRegex(/^<(https?:\/\/[^ >]+)>/)
  },
  url: SimpleMarkdown.defaultRules.url,
  strong: SimpleMarkdown.defaultRules.strong,
  em: SimpleMarkdown.defaultRules.em,
  u: SimpleMarkdown.defaultRules.u,
  br: SimpleMarkdown.defaultRules.br,
  inlineCode: SimpleMarkdown.defaultRules.inlineCode,
  emoticon: {
    order: SimpleMarkdown.defaultRules.text.order,
    match: function(source) {
      return /^(¯\\_\(ツ\)_\/¯)/.exec(source)
    },
    parse: function(capture) {
      return { type: 'text', content: capture[1] }
    }
  },
  codeBlock: {
    order: SimpleMarkdown.defaultRules.codeBlock.order,
    match(source) {
      return /^```(([A-z0-9-]+?)\n+)?\n*([^]+?)\n*```/.exec(source)
    },
    parse(capture) {
      return { lang: (capture[2] || '').trim(), content: capture[3] || '' }
    }
  },
  emoji: {
    order: SimpleMarkdown.defaultRules.text.order,
    match(source) {
      return EMOJI_NAME_AND_DIVERSITY_RE.exec(source)
    },
    parse(capture) {
      const match = capture[0]
      const name = capture[1]
      const surrogate = convertNameToSurrogate(name)
      return surrogate
        ? {
            name: `:${name}:`,
            surrogate: surrogate,
            src: getEmojiURL(surrogate)
          }
        : {
            type: 'text',
            content: match
          }
    },
    react(node, recurseOutput, state) {
      return node.src
        ? createReactElement(Emoji, {
            draggable: false,
            enlarged: node.jumboable,
            alt: node.surrogate,
            // 'data-tip': node.name,
            src: node.src,
            ...emojiTipOptions
          })
        : createReactElement('span', {}, state.key, node.surrogate)
    }
  },
  customEmoji: {
    order: SimpleMarkdown.defaultRules.text.order,
    match(source) {
      return /^<:(\w+):(\d+)>/.exec(source)
    },
    parse(capture) {
      const name = capture[1]
      const id = capture[2]
      return {
        emojiId: id,
        // NOTE: we never actually try to fetch the emote
        // so checking if colons are required (for 'name') is not
        // something we can do to begin with
        name: name,
        src: getEmoteURL({
          id: id
        })
      }
    },
    react(node) {
      return createReactElement(Emoji, {
        draggable: false,
        enlarged: node.jumboable,
        alt: `<:${node.name}:${node.emojiId}>`,
        // 'data-tip': `:${node.name}:`,
        src: node.src,
        ...emojiTipOptions
      })
    }
  },
  animatedEmoji: {
    order: SimpleMarkdown.defaultRules.text.order,
    match(source) {
      return /^<a:(\w+):(\d+)>/.exec(source)
    },
    parse(capture) {
      const name = capture[1]
      const id = capture[2]
      return {
        emojiId: id,
        // NOTE: we never actually try to fetch the emote
        // so checking if colons are required (for 'name') is not
        // something we can do to begin with
        name: name,
        src: getAnimEmoteURL({
          id: id
        })
      }
    },
    react(node) {
      return createReactElement(Emoji, {
        draggable: false,
        enlarged: node.jumboable,
        alt: `<:${node.name}:${node.emojiId}>`,
        // 'data-tip': `:${node.name}:`,
        src: node.src,
        ...emojiTipOptions
      })
    }
  },
  text: {
    ...SimpleMarkdown.defaultRules.text,
    parse(capture, recurseParse, state) {
      return state.nested
        ? {
            content: capture[0]
          }
        : recurseParse(translateSurrogatesToInlineEmoji(capture[0]), {
            ...state,
            nested: true
          })
    }
  },
  s: {
    order: SimpleMarkdown.defaultRules.u.order,
    match: SimpleMarkdown.inlineRegex(/^~~([\s\S]+?)~~(?!_)/),
    parse: SimpleMarkdown.defaultRules.u.parse
  }
}

function createRules(r) {
  const paragraph = r.paragraph
  const url = r.url
  const link = r.link
  const codeBlock = r.codeBlock
  const inlineCode = r.inlineCode

  return {
    // rules we don't care about:
    //  mention
    //  channel
    //  highlight

    // what is highlight?

    ...r,
    s: {
      order: r.u.order,
      match: SimpleMarkdown.inlineRegex(/^~~([\s\S]+?)~~(?!_)/),
      parse: r.u.parse,
      react(node, recurseOutput, state) {
        return createReactElement('s', {}, state.key, recurseOutput(node.content, state))
      }
    },
    paragraph: {
      ...paragraph,
      react(node, recurseOutput, state) {
        return createReactElement('p', {}, state.key, recurseOutput(node.content, state))
      }
    },
    url: {
      ...url,
      match: SimpleMarkdown.inlineRegex(/^((https?|steam):\/\/[^\s<]+[^<.,:;"')\]\s])/)
    },
    link: {
      ...link,
      react(node, recurseOutput, state) {
        // this contains some special casing for invites (?)
        // or something like that.
        // we don't really bother here
        const children = recurseOutput(node.content, state)
        const title = node.title || astToString(node.content)
        return createReactElement(
          Link,
          {
            title: title,
            href: SimpleMarkdown.sanitizeUrl(node.target),
            target: '_blank',
            rel: 'noreferrer'
          },
          state.key,
          children
        )
      }
    },
    inlineCode: {
      ...inlineCode,
      react(node, recurseOutput, state) {
        return createReactElement(
          Code,
          {
            inline: true,
            className: 'inline'
          },
          state.key,
          recurse(node, recurseOutput, state)
        )
      }
    },
    codeBlock: {
      ...codeBlock,
      react(node, recurseOutput, state) {
        if (node.lang && hljs.getLanguage(node.lang) != null) {
          const highlightedBlock = hljs.highlight(node.lang, node.content, true)
          return createReactElement(
            Code,
            {
              language: highlightedBlock.language,
              dangerouslySetInnerHTML: {
                __html: highlightedBlock.value
              }
            },
            state.key
          )
        }

        return createReactElement(Code, {}, undefined, recurse(node, recurseOutput, state))
      }
    }
  }
}

const rulesWithoutMaskedLinks = createRules({
  ...baseRules,
  link: {
    ...baseRules.link,
    match() {
      return null
    }
  }
})

const parseAllowLinks = parserFor(createRules(baseRules))

const parseEmbedTitle = parserFor(omit(rulesWithoutMaskedLinks, ['codeBlock', 'br', 'mention', 'channel', 'roleMention']))

function jumboify(ast) {
  const nonEmojiNodes = ast.some(node => {
    return node.type !== 'img' && (typeof node.content !== 'string' || node.content.trim() !== '')
  })

  if (nonEmojiNodes) {
    return ast
  }

  const maximum = 27
  let count = 0

  ast.forEach((node, i) => {
    node.props.key = i

    if (node.type === 'img') {
      count += 1
    }

    if (count > maximum) {
      return false
    }
  })

  if (count < maximum) {
    ast.forEach(node => (node.props.className += ' jumboable'))
  }

  return ast
}

export { parseAllowLinks, parseEmbedTitle, jumboify }

export default parseText
