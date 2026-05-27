import ExpandableImage from '../../../../../modules/styled-elements/ExpandableImage'
import styled from '../../../../../controllers/emotion'
import { Scale } from '../../../../../modules/styled-elements/ScaledImage'

interface ImageProps {
  height: number
  width: number
}

export const Image = styled(ExpandableImage)<ImageProps>`
  display: block;
  margin: 10px 0;
  cursor: pointer;
  border-radius: 3px;
  ${props =>
    new Scale({
      ...props,
      maxWidth: 400,
      maxHeight: 300
    }).css};

  @media (max-width: 700px) {
    width: 65%;
    height: auto;
  }

  @media (max-width: 650px) {
    width: 70%;
  }

  @media (max-width: 600px) {
    width: 80%;
  }
`
