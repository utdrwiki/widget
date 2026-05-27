import { connect } from '../../../controllers/cerebral'
import * as React from 'react'

import { Field, Root } from './elements'
import Input from './Input'

export let input: HTMLTextAreaElement = null

export default connect()
  .with(({ state, signals, props }) => ({
    channel: state.channel,
    sendMessage: signals.sendMessage,
    clientTyping: signals.typing
  }))
  .toClass(
    props =>
      class Chat extends React.PureComponent<typeof props> {
        state = {
          rows: 1
        }

        onChange(value: string) {
          const rows = value.split(/\r\n|\r|\n/).length
          this.setState({ rows })
          this.typing()
        }

        onSubmit(message: string) {
          if (message.length === 0) return

          const { sendMessage } = this.props

          sendMessage({ message })

          // TODO: Clear the input field only when the user is signed in.
          // Currently it's throwing an error whenever I observe the
          // state.user object. It's probably due to the shit-ish flow
          // that I created, or a bug with cerebral.
          input.value = ''
        }

        isTyping(typing: boolean) {
          const { clientTyping } = this.props
          clientTyping({ typing })
        }

        render() {
          const { channel } = this.props

          return (
            <Root className="chat">
              <Field rows={this.state.rows} className="field">
                <Input
                  onChange={this.onChange.bind(this)}
                  onSubmit={this.onSubmit.bind(this)}
                  innerRef={ref => (input = ref)}
                  innerProps={{
                    placeholder: `Message #${channel.name}`
                  }}
                />
                {/* <Emoji /> */}
              </Field>
            </Root>
          )
        }

        monitor = {
          last: null,
          timer: null
        }

        typing() {
          // Typing timeout threshold
          const threshold = 1000

          const now = +new Date()
          const { monitor } = this

          // Clear the previous stopped-typing timer
          clearTimeout(this.monitor.timer)

          // If they don't register a keypress within the threshold
          // then they've stopped typing
          this.monitor.timer = setTimeout(() => {
            this.isTyping(false)
            this.monitor.last = null
          }, threshold)

          // If the threshold time has passed, then send another
          // keypress event to the server
          if (now - monitor.last > threshold) {
            this.isTyping(true)
            monitor.last = now
          }
        }
      }
  )
