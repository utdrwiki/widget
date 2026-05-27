import styled, { CreateStyled } from '@emotion/styled'
import { Theme } from '../../../controllers/emotion'

import Message from '../../../types/message'

export * from '../../../controllers/emotion'

interface Context extends Theme {
  message: Message
}
export default styled as CreateStyled<Context>
