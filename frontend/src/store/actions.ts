import { Context } from '../controllers/cerebral'
import * as _ from 'lodash'
import { addNotification } from '../app/notify'
import { Notification } from 'react-notification-system'
import { socket } from '../controllers/socket-io'
import Message, { Reaction } from '../types/message'
import Modal from '../types/modal'
import { Channel } from './types'
import { Dictionary } from '@cerebral/fluent'

interface Props {
  message: Message
}

export interface SignInData {
  channel: Channel
  messages: Message[]
  name: string
  token: string
}

export function setMessage({ state, props }: Context<Props>) {
  state.messages.set(props.message.id, props.message)
  state.channel.lastSeenID = props.message.id
}

export function deleteMessage({ state, props }: Context<{ id: string }>) {
  state.messages.delete(props.id)
}

export function deleteMessageBulk({ state, props }: Context<{ ids: string[] }>) {
  props.ids.forEach(id => state.messages.delete(id))
}

export function sendMessage({ props }: Context<{ message: string }>) {
  // TODO: Some kind of indicator that the message is being sent
  socket.emit('sendMessage', props)
}

export function messageReactionAdd({ state, props }: Context<{
  id: string
  reaction: Reaction
}>) {
  const message = state.messages.get(props.id)
  if (!message) {
    return
  }
  if (!message.reactions) message.reactions = []
  const sameReaction = message.reactions.find(r => r.id === props.reaction.id && r.name === props.reaction.name)
  if (sameReaction) {
    sameReaction.count = props.reaction.count
  } else {
    message.reactions.push(props.reaction)
  }
}

export function messageReactionRemove({ state, props }: Context<{
  id: string
  reaction: Reaction
}>) {
  const message = state.messages.get(props.id)
  if (message && message.reactions) {
    message.reactions = message.reactions.filter(r => !(r.id === props.reaction.id && r.name === props.reaction.name))
  }
}

export function signIn({ state, props }: Context<SignInData>) {
  const { channel, messages, name, token } = props
  localStorage.setItem('token', token)

  state.user = {
    name,
    id: ''
  }
  state.channel = {
    ...channel,
    lastSeenID: channel.lastSeenID || (messages.length ? messages[messages.length - 1].id : '')
  }
  state.messages = Dictionary(_.keyBy(messages, 'id'))
  state.loading = false
  addNotification({
    level: 'success',
    title: 'Welcome!',
    message: 'You are viewing the Discord channel where wiki users discuss your feedback. You can join the server if you want to participate from the other side!',
  });
}

export function notify({ state, props }: Context<{ notification: Notification | Notification[] }>) {
  addNotification(props.notification);
}

export const loading = (status: boolean) => ({ state, props }: Context) => {
  state.loading = status
}

export function modal({ state, props }: Context<{ open: boolean; type?: Modal['type']; data?: Modal['data'] }>) {
  state.modal = { ...state.modal, ...props }
}

export function typing({ props }: Context<{ typing: boolean }>) {
  socket.emit('typing', props)
}
