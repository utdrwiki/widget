import Notifications from './notify'
import * as React from 'react'
import initiate from '../controllers/socket-io'
import Messages from '../components/Messages'
import Modal from '../components/Modal'

export default class App extends React.PureComponent {
  componentDidMount() {
    initiate()
  }

  render() {
    return (
      <React.Fragment>
        <Modal />
        <Notifications />
        <Messages />
      </React.Fragment>
    )
  }
}
