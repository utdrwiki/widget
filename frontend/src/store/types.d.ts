import { Dictionary } from '@cerebral/fluent'
import Modal from '../types/modal'
import * as signals from './sequences'
import Message from '../types/message'

export interface User {
  name: string
  id: string
}

export interface Channel {
  name: string
  id: string
  type: number
  category: string
  permissions: string[]
  lastSeenID: string
  unread: boolean
  topic?: string
}

export interface Theme {
  primary: string
  accent: string
  background: string
}

export interface State {
  loading: boolean
  modal: Modal
  user: User
  channel: Channel
  messages: Dictionary<Message>
  messageQueue: string[]
}

export type Signals = { [key in keyof typeof signals]: typeof signals[key] }
