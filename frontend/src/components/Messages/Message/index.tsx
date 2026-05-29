import { ThemeProvider } from 'emotion-theming'
import { parseText } from '../../Markdown/render'
import * as React from 'react'
import message from '../../../types/message'
import Author, { Timestamp } from './Author'
import { Avatar, Content, Group, JoinMember, JoinText, Messages, Reactions, Root, Sys } from './elements'
import Reaction from './Reaction'
import Reply from './Reply'

interface Props {
  messages: message[]
  lastSeen: string
  all: message[]
}

class Message extends React.PureComponent<Props, any> {
  theme = message => theme => ({
    ...theme,
    message
  })

  render() {
    const { messages, lastSeen, all } = this.props
    const [message] = messages

    return (
      <div>
        {message.reference && <Reply id={message.reference} messages={all} />}
        <Group className="group">
          <Avatar url={message.author.avatar} className="avatar" />
          <Messages className="messages">
            <Author author={message.author} time={message.timestamp} />

            {messages.map((message, i) => (
              <ThemeProvider key={i} theme={this.theme(message)}>
                <Root className="message" key={message.id}>
                  <Content className="content">{parseText(message)}</Content>

                  {message.reactions && (
                    <Reactions className="reactions">{message.reactions.map((reaction, i) => <Reaction key={i} {...reaction} />)}</Reactions>
                  )}

                  {// If the message is the last one seen by the user
                  message.id === lastSeen &&
                    // And it's not at the end of the list
                    i !== messages.length - 1 && (
                      <Sys.Container className="system-message">
                        <Sys.Lines>
                          <Sys.Message>New Messages</Sys.Message>
                        </Sys.Lines>
                      </Sys.Container>
                    )}
                </Root>
              </ThemeProvider>
            ))}
          </Messages>
        </Group>
      </div>
    )
  }
}

export default Message
