import * as React from 'react'

import { Reaction } from '../../../../types/message'
import { Count, Emoji, Root } from './elements'

const Reaction = ({ name, id, count }: Reaction) => (
  <Root className="reaction" title={name}>
    {id ? (
      <Emoji src={`https://cdn.discordapp.com/emojis/${id}`} />
    ) : (
      <Emoji className="reaction-emoji">{name}</Emoji>
    )}
    <Count className="reaction-count">{count}</Count>
  </Root>
)

export default Reaction
