import styled, { CreateStyled } from '@emotion/styled'
import { Theme } from '../../../controllers/emotion'

import Modal from '../../../types/modal'

export * from '../../../controllers/emotion'

interface Context extends Theme {
  modal: Modal
}
export default styled as CreateStyled<Context>
