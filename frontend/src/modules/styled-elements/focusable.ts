import { css } from 'emotion'
import { Theme } from '../../controllers/emotion'

interface Props {
  theme: Theme
}

const focusable = (props: Props) => css`
  &::after {
    content: '';
    border: 2px solid ${props.theme.accent};
    position: absolute;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.1s ease;
  }

  &:focus:not(:hover)::after {
    opacity: 1;
  }
`

export default focusable
