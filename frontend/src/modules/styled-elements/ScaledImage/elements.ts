import styled from '../../../controllers/emotion'

export const Root = styled.img`
  width: ${({ width }) => (width ? `${width}px` : null)};
  width: ${({ height }) => (height ? `${height}px` : null)};
`
