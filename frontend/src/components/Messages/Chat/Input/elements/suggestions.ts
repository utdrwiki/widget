import { ScrollOverlay } from '../../../../../modules/styled-elements/scrollable'
import styled from '../../../../../controllers/emotion'

interface Props {
  length: number
}

export const Description = styled.div`
  padding: 5px 17px;
  font-size: 12px;
  text-transform: uppercase;
  line-height: 16px;
  color: ${({ theme }) => theme._primary.fadeOut(0.5).toString()};

  strong {
    text-transform: none;
    font-weight: 500;
    color: ${({ theme }) => theme.primary};
  }
`

export const Suggestions = styled(ScrollOverlay)<Props>`
  position: absolute !important;
  left: 0;
  border-radius: 5px 5px 0 0;
  padding: 8px 0;
  background-color: ${({ theme }) =>
    theme._background.darken(0.05).toString()};
  bottom: calc(100% - 5px);

  height: ${({ length }) =>
    (length > 9 ? 300 : length * 32) + 8 * 2 + 26}px !important;
  max-height: calc(100vh - 130px);

  & > div:nth-child(1) {
    padding: 8px 0;
  }
`
