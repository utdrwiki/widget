import { Dictionary } from '@cerebral/fluent'

import Message from './message'

type Channels = {
  name: string
  unread: boolean
  id: string
  type: number
  category: string
  permissions: string[]
}[]

export interface Channel {
  name: string
  permissions: string[]
  topic?: string
  id?: string
  messages?: Dictionary<Message>
}

export interface ChannelResponse {
  channel: Channel
}
