import { ThemeProvider as Provider } from 'emotion-theming'
import { connect } from '../controllers/cerebral'
import Color from 'kolor'
import * as React from 'react'
import { GlobalStyles } from './elements'
import config from '../modules/config'

const ThemeProvider = connect()
  .with(({}) => ({
    theme: {
      ...config.theme,
      _primary: Color(config.theme.primary),
      _background: Color(config.theme.background),
      _accent: Color(config.theme.accent)
    }
  }))
  .toClass(
    props =>
      class ThemeProvider extends React.PureComponent<typeof props> {
        componentDidMount() {
          const { theme } = this.props
          GlobalStyles.inject(theme)
        }

        componentWillReceiveProps(nextProps: typeof props) {
          const { theme } = nextProps
          GlobalStyles.update(theme)
        }

        render() {
          return <Provider {...this.props} />
        }
      }
  )

export default ThemeProvider
