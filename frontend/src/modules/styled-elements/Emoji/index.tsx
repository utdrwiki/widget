import { cx } from 'emotion'
import * as _ from 'lodash'
import * as React from 'react'
import emoji from 'react-easy-emoji'
import { Base, Emote } from './elements'
import { iterate } from './emojiMap'

const cache = new Map<string, string>()

interface Props {
  [key: string]: any
  children?: any
  text?: string
  className?: string
  resolveNames?: boolean
  onlyEmojiClassName?: string
  src?: string
}

class Emoji extends React.PureComponent<Props> {
  render() {
    let text = this.getText()
    let { className, resolveNames, src } = this.props

    // Return a custom emoji
    if (src) return <Emote src={src} className={cx('emoji', className)} />

    // Validate props
    if (typeof text !== 'string') {
      if (typeof text === 'undefined' || text === null) return null

      return React.cloneElement(text, {
        className: cx('emoji', Base, className)
      })
    }

    // Resolve all text representations of emojis
    // uses a cache store to reduce
    if (resolveNames) text = this.resolve(text)

    const resolved = emoji(text, (code, string, key) => (
      <Emote
        ref={this.handleErrors.bind(this)}
        src={`https://twitter.github.io/twemoji/2/svg/${code}.svg`}
        alt={string}
        className={cx('emoji', className)}
        key={key}
      />
    ))

    return this.jumbofy(resolved)
  }

  getText() {
    let { children, text } = this.props
    return children && !text ? children : text
  }

  resolve(text: string) {
    if (cache.has(text)) {
      return cache.get(text)
    }

    let parsed = text
    iterate(({ keywords, emoji }) =>
      keywords.forEach(keyword => {
        parsed = parsed.split(`:${keyword}:`).join(emoji)
      })
    )

    cache.set(text, parsed)
    return parsed
  }

  /**
   * Resolves emojis as text embedded inside SVG if the CDN fails to load
   */
  handleErrors(img: HTMLImageElement) {
    if (!img) return

    img.onerror = () => {
      const alt = img.getAttribute('alt')
      if (alt === null) return

      img.setAttribute(
        'src',
        `data:image/svg+xml;charset=UTF-8, ${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100" preserveAspectRatio="xMidYMid meet"><text font-size="80" dy=".35em" dx="-0.7em">${_.escape(
            alt
          )}</text></svg>`
        )}`
      )
    }
  }

  jumbofy(fragment: any[]) {
    const { onlyEmojiClassName } = this.props

    if (onlyEmojiClassName) {
      // Iterate through all fragment elements
      // until a either the fragment is not an object
      // and it's string contains characters other than
      // a space (or line break)
      const onlyEmoji = !fragment.find(
        fragment => !(fragment instanceof Object || !/\S/.test(fragment))
      )

      if (onlyEmoji) {
        return fragment.map(
          piece =>
            piece instanceof Object
              ? React.cloneElement(piece, {
                  className: cx(onlyEmojiClassName, piece.props.className)
                })
              : piece
        )
      }
    }

    return fragment
  }
}

export default Emoji
