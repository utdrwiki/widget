import { Context } from '../controllers/cerebral'
import Message, { Reaction } from '../types/message'
import Modal from '../types/modal'
import * as actions from './actions'
import { SequenceWithPropsFactory } from '@cerebral/fluent'

interface message {
  message: Message
}

export const sequenceWithProps = SequenceWithPropsFactory<Context>()

export const insertMessage = sequenceWithProps<message>(s => s.action(actions.setMessage))

export const updateMessage = sequenceWithProps<message>(s => s.action(actions.setMessage))

export const deleteMessage = sequenceWithProps<{ id: string }>(s => s.action(actions.deleteMessage))

export const deleteMessageBulk = sequenceWithProps<{
  ids: string[]
}>(s => s.action(actions.deleteMessageBulk))

export const sendMessage = sequenceWithProps<{ message: string }>(s => s.action(actions.sendMessage))

export const messageReactionAdd = sequenceWithProps<{
  id: string
  reaction: Reaction
}>(s => s.action(actions.messageReactionAdd))

export const messageReactionRemove = sequenceWithProps<{
  id: string
  reaction: Reaction
}>(s => s.action(actions.messageReactionRemove))

export const modal = sequenceWithProps<{
  open: boolean
  type?: Modal['type']
  data?: Modal['data']
}>(s => s.action(actions.modal))

export const typing = sequenceWithProps<{ typing: boolean }>(s => s.action(actions.typing))

export const signIn = sequenceWithProps<actions.SignInData>(s => s.action(actions.signIn))
