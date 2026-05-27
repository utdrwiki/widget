import { css } from 'emotion'
import styled from '../../../controllers/emotion'

export const Base = css`
  width: 1em;
  height: 1em;
  margin: 0px 0.05em 0px 0.1em;
  vertical-align: -0.1em;
`

export const Emote = styled.img`
  ${Base};
`
