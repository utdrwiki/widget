import styled from '../ThemeContext'

interface Props {
  bgcolor: number
}
export const ColorPill = styled('div')<Props>`
  width: 4px;
  border-radius: 3px 0 0 3px;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  background-color: ${({ bgcolor }) =>
    bgcolor
      ? `rgba(${(bgcolor >> 16) & 0xff},${(bgcolor >> 8) & 0xff},${bgcolor &
          0xff},1)`
      : `rgba(255, 255, 255, 0.2)`};
`
