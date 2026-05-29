import { connect } from '../../../../controllers/cerebral'
import Moment from 'moment'
import * as React from 'react'

import { Author } from '../../../../types/message'
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
    toggle: signals.modal,
    me: state.user.name,
  }))
  .toClass(
    props =>
      class MessageAuthor extends React.PureComponent<typeof props> {
        tags() {
          const { author } = this.props

          if (author.type === 'bot') {
            return <Tag className="bot">Bot</Tag>
          }
          if (author.type === 'guest') {
            if (author.name === this.props.me) {
              return <Tag className="you">You</Tag>
            } else {
              return <Tag className="guest">Guest</Tag>
            }
          }
          return <></>;
        }

        render() {
          const { author, time } = this.props
          const name = author.name === this.props.me ? 'You' : author.name;

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
