import { connect } from '../../../../controllers/cerebral'
import Moment from 'moment'
import * as React from 'react'

import { Author } from '../../../../types/message'
import parseUsername from '../parseUsername'
import { Name, Root, Tag, Time } from './elements'

interface Props {
  author: Author
  time: number
}

export const Timestamp = ({ time }: { time: number }) => (
  <Time className="time">{Moment(time).calendar()}</Time>
)

export default connect<Props>()
  .with(({ state, signals, props }) => ({
    toggle: signals.modal
  }))
  .toClass(
    props =>
      class MessageAuthor extends React.PureComponent<typeof props> {
        tags() {
          const { author } = this.props

          return (
            <React.Fragment>
              {author.type === 'bot' && <Tag className="bot">Bot</Tag>}
              {author.type === 'guest' && <Tag className="guest">Guest</Tag>}
            </React.Fragment>
          )
        }

        render() {
          const { author, time } = this.props
          const { name } = parseUsername(author.name)

          return (
            <Root className="author">
              <Name color={author.color} className="name">
                {name}
              </Name>
              {this.tags()}
              <Timestamp time={time} />
            </Root>
          )
        }
      }
  )
