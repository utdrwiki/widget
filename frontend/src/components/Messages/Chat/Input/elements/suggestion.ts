import { Twemoji } from '../../../Message/Markdown/elements/emoji'
import { css } from 'emotion'
import styled from '../../../../../controllers/emotion'

interface Props {
  selected: boolean
}

export const Suggestion = styled.li<Props>`
  display: flex;
  cursor: pointer;
  height: 32px;
  margin: 0 8px;
  font-size: 14px;
  line-height: 16px;
  border-radius: 3px;
  padding: 8px;
  ${({ selected, theme }) =>
    selected
      ? css`
          background-color: ${theme._primary.fadeOut(0.95).toString()};
        `
      : null};
`

export const Icon = styled(Twemoji)`
  width: 16px;
  height: 16px;
  text-align: center;
  flex-shrink: 0;
`

export const Name = styled.div`
  margin-left: 10px;
  flex-grow: 1;
  flex-shrink: 0;
`

export const Info = styled('div')`
  overflow: hidden;
  margin-left: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ theme }) => theme._primary.fadeOut(0.75).toString()};
`
