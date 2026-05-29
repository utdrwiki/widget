import { injectGlobal } from 'emotion'
import styled, { Theme } from '../controllers/emotion'

export const Notifications = styled.div`
  button {
    cursor: pointer;
    outline: 0;
    font-weight: 500 !important;
  }

  .notifications-br {
    inset: 50px 0 auto auto !important;
  }

  .notification {
    background-color: ${({ theme }) =>
      theme._background.lighten(0.1).toString()} !important;
    min-height: 60px;
    height: auto !important;
  }

  .notification-dismiss {
    background-color: ${({ theme }) =>
      theme._background.lighten(0.4).toString()} !important;
  }
`

export namespace GlobalStyles {
  export function inject(theme: Theme) {
    injectGlobal`
      html, body, #root {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: ${theme.background};
        overflow: hidden;
      }

      #root {
        opacity: 1 !important;
        transform: initial !important;
      }

      /* Resets */
      * {
        color: ${theme.primary};
        font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande,
          sans-serif;
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
        word-break: break-word;
      }
    `
  }

  export function update(theme: Theme) {
    injectGlobal`
      html, body, #root {
        width: 100%;
        height: 100%;
        background-color: ${theme.background};
      }

      /* Resets */
      * {
        color: ${theme.primary};
      }
    `
  }
}
