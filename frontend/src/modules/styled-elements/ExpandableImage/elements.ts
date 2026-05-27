import styled from '../../../controllers/emotion'

import { Loading } from '../../../components/Overlays'
import { Scale } from '../ScaledImage'

interface Props {
  maxHeight: number
  maxWidth: number
  height: number
  width: number
}

export const Root = styled.div<Props>`
  position: relative;
  overflow: hidden;
  ${props => new Scale(props).css};
`

export const Image = styled.img`
  width: 100%;
  height: 100%;
`

export const Loader = styled(Loading)`
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.1);
`
