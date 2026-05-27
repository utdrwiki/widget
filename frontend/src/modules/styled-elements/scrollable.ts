import { Scrollbars } from 'react-custom-scrollbars'
import styled from '../../controllers/emotion'

interface Props {
  className?: string
}

/**
 * Visible scrollbar
 */
export const ScrollVisible = styled(Scrollbars)<Props>`
  display: flex;
  height: 100%;
  width: 100%;
  & > div {
    &:nth-child(1) {
      overflow-x: hidden !important;
      overflow-y: scroll !important;
      & > div {
        &:nth-child(1) {
          margin-top: 15px;
        }
        &:last-child {
          margin-bottom: 15px;
          border-bottom: none;
        }
      }
    }
    &:nth-child(2) {
      display: none;
    }
    &:nth-child(3) {
      background-color: rgba(0, 0, 0, 0.15);
      border-radius: 50px !important;
      width: 8px !important;
      & > div {
        cursor: default !important;
        background-color: rgba(0, 0, 0, 0.3) !important;
        border-radius: 50px !important;
        width: 14px !important;
        margin-left: -3px !important;
        border: 3px solid ${({ theme }) => theme.background};
      }
    }
  }
`

/**
 * Overlaid scrollbar
 */
export const ScrollOverlay = styled(Scrollbars)`
  & > div:nth-child(3) {
    & > div {
      cursor: default !important;
      opacity: 0;
      transition: opacity 0.1s ease;
      &:hover {
        opacity: 1;
      }
    }
  }
  & > div:hover + div + div {
    & > div {
      opacity: 1;
    }
  }
`
