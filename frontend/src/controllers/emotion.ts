import styled, { CreateStyled } from '@emotion/styled'
import { Theme as StoreTheme } from '../store/types'

type Color = any

export interface Theme extends StoreTheme {
  _primary: Color
  _accent: Color
  _background: Color
}

export default styled as CreateStyled<Theme>
