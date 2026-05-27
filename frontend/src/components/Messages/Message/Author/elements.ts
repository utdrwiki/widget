import styled from '../../../../controllers/emotion'

// Root
export const Root = styled.span`
  display: flex;
  height: 24px;
  line-height: 24px;
  overflow: hidden;
`

// Username
interface NameProps {
  color: string
}

export const Name = styled.strong<NameProps>`
  color: ${({ color }) => (color !== '#000000' ? color : null)};
  cursor: pointer;
  font-size: 16px;
  flex-shrink: 0;
  font-weight: 500;
  letter-spacing: 0;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 340px), (max-height: 370px) {
    font-size: 14px;
  }
`

// Timestamp
export const Time = styled.span`
  color: ${({ theme }) => theme._primary.fadeOut(0.8).toString()};
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0;
  margin-left: 6px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-transform: none;

  @media (max-width: 400px), (max-height: 420px) {
    font-size: 11px;
  }

  @media (max-width: 340px), (max-height: 370px) {
    font-size: 10px;
  }

  @media (max-width: 220px) {
    display: none;
  }
`

export const Tag = styled.span`
  user-select: none;
  color: #fff;
  line-height: 16px;
  font-size: 10px;
  font-weight: 500;
  flex-shrink: 0;
  vertical-align: top;
  background: ${({ theme }) => theme.accent};
  border-radius: 3px;
  padding: 0 0.275rem;
  height: 0.9375rem;
  margin-left: 6px;
  margin-top: 4px;
  margin-bottom: 4px;
  text-transform: uppercase;

  @media (max-width: 340px), (max-height: 370px) {
    font-size: 8px;
    font-weight: 400;
    margin-left: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    line-height: 13px;
  }
`
