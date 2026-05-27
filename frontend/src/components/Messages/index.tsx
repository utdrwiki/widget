import { connect } from '../../controllers/cerebral'
import * as React from 'react'
import { ScrollVisible } from '../../modules/styled-elements/scrollable'
import Header, { Name, Topic } from '../Header'
import { Join, Stretch } from '../Header/elements'
import { Loading, NoMessages } from '../Overlays'
import ErrorAhoy from '../Overlays/ErrorAhoy'
import { Wrapper } from './elements'
import Chat from './Chat'
import Group from './group'
import Message from './Message'
import config from '../../modules/config'

export default connect()
  .with(({ state }) => {
    return {
      loading: state.loading,
      channel: state.channel,
      messages: state.messages.values()
    }
  })
  .toClass(
    props =>
      class Messages extends React.PureComponent<typeof props> {
        getContent = () => {
          const { loading } = this.props
          const { channel, messages } = this.props

          if (loading) {
            return <Loading />
          }

          if (messages) {
            const grouped = Group(messages)

            return grouped.length ? (
              <ScrollVisible ref={this.scroll.bind(this)} className="messages">
                {grouped.map(group => <Message messages={group} key={group[0].id} lastSeen={channel.lastSeenID} all={messages} />)}
              </ScrollVisible>
            ) : (
              <NoMessages className="no-messages" />
            )
          }

          return null
        }

        render() {
          const { channel } = this.props

          const header = channel && (
            <Header>
              <Stretch>
                <Name>{channel.name}</Name>
                {channel.topic && <Topic>{channel.topic}</Topic>}
              </Stretch>
              <Join href={config.invite} target="_blank">
                Join
              </Join>
            </Header>
          )
          const content = this.getContent()

          return content ? (
            <Wrapper>
              {header}
              {content}
              {/* TODO: Implement chat restriction */}
              {true && <Chat />}
            </Wrapper>
          ) : (
            <ErrorAhoy />
          )
        }

        position = -1
        scrollable

        scroll(ref) {
          if (!ref) return
          this.scrollable = ref

          if (this.scrollable) {
            if (this.position === -1) {
              this.scrollable.scrollToBottom()
            } else {
              this.scrollable.scrollTop(this.position)
            }
          }
        }
      }
  )
