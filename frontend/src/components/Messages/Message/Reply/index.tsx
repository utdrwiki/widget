import * as React from 'react'
import Message from '../../../../types/message'
import { RepliedTextContent, ReplyText, ReplyTextPreview, Root } from './elements'

const Reply = ({ id, messages }) => {
  const message = messages.find((msg: Message) => id === msg.id)
  if (!message) {
    return (
      <Root>
        <ReplyText>
          <em>Message could not be retrieved.</em>
        </ReplyText>
      </Root>
    )
  }
  return (
    <Root className="message-reply-context">
      <img src={message.author.avatar} alt={''} style={{ borderRadius: '50%', width: '16px', height: '16px', userSelect: 'none', marginRight: '0.25rem' }} />
      <span
        style={{
          color: message.author.color,
          fontSize: '14px',
          marginRight: '0.25rem',
          opacity: 0.64,
          lineHeight: '1.125rem',
          verticalAlign: '1.5px'
        }}
      >
        @{message.author.name}
      </span>
      <ReplyTextPreview className="replyTextPreview">
        <RepliedTextContent className="repliedTextContent">{message.content}</RepliedTextContent>
      </ReplyTextPreview>
    </Root>
  )
}

export default Reply
