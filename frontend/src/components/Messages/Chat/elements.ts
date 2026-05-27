import { css } from 'emotion'
import styled from '../../../controllers/emotion'

export const Root = styled.form`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding-top: 10px;
  position: relative;
  margin: 0 15px 20px;
  box-shadow: 0 -1px 0 hsla(0, 0%, 100%, 0.06);
`

export const Typing = styled.div``

interface FieldProps {
  rows: number
}
export const Field = styled.div<FieldProps>`
  display: flex;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme._primary.fadeOut(0.9).toString()};
  height: ${({ rows }) => (rows > 7 ? 7 : rows) * 20 + 22}px;
`
