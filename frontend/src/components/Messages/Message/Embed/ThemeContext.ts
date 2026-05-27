import styled, { CreateStyled } from '@emotion/styled'
import { Theme } from '../../../../controllers/emotion'

import { Embed } from '../../../../types/message'

export * from '../../../../controllers/emotion'

interface Context extends Theme {
  embed: Embed
}
export default styled as CreateStyled<Context>
