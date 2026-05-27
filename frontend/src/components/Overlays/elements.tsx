import * as React from 'react'
import styled from '../../controllers/emotion'

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  & > *:first-child {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  & > svg {
    opacity: 0.08;
    height: 40%;
    width: 40%;
  }
`

export const Wrap = function<T>(wrapper: T): T {
  const Component: any = wrapper
  return (props => (
    <Root {...props}>
      <Component />
    </Root>
  )) as any
}
