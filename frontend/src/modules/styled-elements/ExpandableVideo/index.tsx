import { connect } from '../../../controllers/cerebral'
import * as React from 'react'

import { Video, Loader, Root } from './elements'

interface Props {
  src: string
  className?: string

  height?: number
  width?: number
  maxWidth?: number
  maxHeight?: number
}

/**
 * Expandable video
 */
const ExpandableVideo = connect<Props>()
  .with(({ state, signals, props }) => ({
    toggle: signals.modal
  }))
  .toClass(
    props =>
      class ExpandableVideo extends React.PureComponent<typeof props> {
        state = {
          type: 'loading'
        }

        open() {
          const { src, toggle } = this.props
          if (src) {
            toggle({
              open: true,
              type: 'video',
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
              <Video
                autoPlay
                loop
                muted
                onCanPlay={() => this.setState({ type: 'loaded' })}
                onError={() => this.setState({ type: 'error' })}
                src={src}
              />
              {this.state.type === 'loading' && <Loader />}
            </Root>
          )
        }
      }
  )

export default ExpandableVideo
