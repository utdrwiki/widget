import { connect } from '../../../controllers/cerebral'
import * as React from 'react'

import { Image, Loader, Root } from './elements'

interface Props {
  src: string
  className?: string

  height?: number
  width?: number
  maxWidth?: number
  maxHeight?: number
}

/**
 * Expandable image
 */
const ExpandableImage = connect<Props>()
  .with(({ signals }) => ({
    toggle: signals.modal
  }))
  .toClass(
    props =>
      class ExpandableImage extends React.PureComponent<typeof props> {
        state = {
          type: 'loading'
        }

        open() {
          const { src, toggle } = this.props
          if (src) {
            toggle({
              open: true,
              type: 'image',
              data: src
            })
          }
        }

        render() {
          const {
            className,
            height,
            width,
            maxHeight,
            maxWidth,
            src
          } = this.props

          return (
            <Root
              className={className}
              onClick={this.open.bind(this)}
              maxHeight={maxHeight}
              maxWidth={maxWidth}
              height={height}
              width={width}
            >
              <Image
                src={src}
                onLoad={() => this.setState({ type: 'loaded' })}
                onError={() => this.setState({ type: 'error' })}
              />
              {this.state.type === 'loading' && <Loader />}
            </Root>
          )
        }
      }
  )

export default ExpandableImage
