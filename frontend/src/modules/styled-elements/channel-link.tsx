import { connect } from '../../controllers/cerebral'
import * as React from 'react'

interface Props {
  className?: string
}

const ChannelLink = connect<Props>()
  .with(() => ({}))
  .toClass(
    props =>
      class ChannelLink extends React.PureComponent<typeof props> {
        render() {
          return (
            <span className={this.props.className}>{this.props.children}</span>
          )
        }
      }
  )

export default ChannelLink
