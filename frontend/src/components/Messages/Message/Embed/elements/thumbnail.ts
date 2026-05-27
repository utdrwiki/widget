import { css } from 'emotion'
import ExpandableImage from '../../../../../modules/styled-elements/ExpandableImage'

import styled from '../ThemeContext'

interface Props {
  rich?: boolean
}
export const Thumbnail = styled(ExpandableImage)<Props>`
  border-radius: 3px;
  object-fit: contain;
  flex-shrink: 0;
  cursor: pointer;

  ${({ rich, theme }) =>
    rich
      ? css`
          margin: 5px 0;
        `
      : /^article|image$/.test(theme.embed.url) //TODO: Fix at some point
        ? css`
            margin-top: 8px;
          `
        : css`
            margin-left: 20px;
          `};
`
