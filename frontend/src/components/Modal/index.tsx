import { ThemeProvider } from 'emotion-theming'
import { connect } from '../../controllers/cerebral'
import * as React from 'react'
import { Box, Close, Image, OpenImage, Root } from './elements'
import { OpenVideo, Video } from './elements/video'

export default connect()
  .with(({ state, signals }) => ({
    modal: state.modal,
    toggle: signals.modal
  }))
  .toClass(
    props =>
      class Modal extends React.PureComponent<typeof props> {
        state = {
          open: this.props.modal.open
        }
        timer

        componentWillReceiveProps(nextProps) {
          const { open } = nextProps.modal
          if (open) {
            this.setState({ open })
          } else {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => this.setState({ open }), 100)
          }
        }

        theme = theme => ({
          ...theme,
          modal: this.props.modal
        })

        content = () => {
          const { modal } = this.props

          if (modal.type === 'image') {
            return (
              <React.Fragment>
                <Image src={modal.data} />
                <OpenImage
                  href={modal.data}
                  target="_blank"
                  onClick={this.close.bind(this)}
                >
                  Open original
                </OpenImage>
              </React.Fragment>
            )
          }

          if (modal.type === 'video') {
            return (
              <React.Fragment>
                <Video autoPlay loop muted src={modal.data} />
                <OpenVideo
                  href={modal.data}
                  target="_blank"
                  onClick={this.close.bind(this)}
                >
                  Open original
                </OpenVideo>
              </React.Fragment>
            )
          }

          return null
        }

        render() {
          return (
            <ThemeProvider theme={this.theme.bind(this)}>
              <Root
                onClick={e =>
                  e.target === e.currentTarget ? this.close() : null
                }
                className="modal"
              >
                <Box className="box">
                  <Close onClick={this.close.bind(this)} className="close" />
                  {this.state.open && <this.content />}
                </Box>
              </Root>
            </ThemeProvider>
          )
        }

        componentDidMount() {
          window.addEventListener('keydown', this.listener)
        }

        componentWillUnmount() {
          window.removeEventListener('keydown', this.listener)
        }

        listener = ({ keyCode }: KeyboardEvent) => {
          const { modal } = this.props

          if (modal.open) {
            switch (keyCode) {
              case 27:
                this.close()
            }
          }
        }

        close() {
          const { toggle } = this.props

          toggle({
            open: false
          })
        }
      }
  )
