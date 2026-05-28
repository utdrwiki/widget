import * as React from 'react'
import N from 'react-notification-system'

import { Notifications } from './elements'
import config from '../modules/config'

const initial: N.Notification[] = []
let ref: ((notification: N.Notification) => void) | null = null

export const addNotification = (
  notifications: N.Notification | N.Notification[]
) => {
  if (!(notifications instanceof Array)) notifications = [notifications]

  notifications.forEach(n => {
    const notification = {
      ...n,
      message:
        typeof n.message === 'string' ? n.message : JSON.stringify(n.message),
      action: {
        label: 'Join the server',
        callback() {
          window.open(config.invite);
        }
      }
    }

    if (ref) return ref(notification)

    initial.push(notification)
  })
}

class Notify extends React.PureComponent {
  notifications: N | null = null

  render() {
    return (
      <Notifications>
        <N ref={ref => (this.notifications = ref)} />
      </Notifications>
    )
  }

  componentDidMount() {
    if (initial.length) {
      for (let notification of initial) {
        this.addNotification(notification)
      }
    }
    ref = this.addNotification.bind(this)
  }

  addNotification(notification: N.Notification) {
    if (this.notifications) {
      this.notifications.addNotification({
        position: 'br',
        ...notification
      })
    }
  }
}

export default Notify
