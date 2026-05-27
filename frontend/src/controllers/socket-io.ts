import { addNotification } from '../app/notify'
import io from 'socket.io-client'
import controller from './cerebral'

export const socket = io({
  autoConnect: false,
  path: '/discord-socket/',
  transports: ['websocket'],
  query: {
    token: localStorage.getItem('token') ?? '',
    userId: Number(new URLSearchParams(location.search).get('user'))
  }
})

const initiate = () => {
  socket.connect()
  socket.on('signIn', controller.signals.signIn)
  socket.on('message', controller.signals.insertMessage)
  socket.on('messageUpdate', controller.signals.updateMessage)
  socket.on('messageDelete', controller.signals.deleteMessage)
  socket.on('messageDeleteBulk', controller.signals.deleteMessageBulk)
  socket.on('messageReactionAdd', controller.signals.messageReactionAdd)
  socket.on('messageReactionRemove', controller.signals.messageReactionRemove)
  socket.on('notify', addNotification)
}

export default initiate
