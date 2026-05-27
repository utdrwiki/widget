import './app/res/index.css'
import { Container } from '@cerebral/react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './app'
import ThemeProvider from './app/ThemeProvider'
import controller from './controllers/cerebral'
import { cache } from 'emotion'
import { CacheProvider } from '@emotion/core'

ReactDOM.render(
  <Container controller={controller}>
    <CacheProvider value={cache}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </CacheProvider>
  </Container>,
  document.getElementById('root')
)
