import * as React from 'react'

import { Error } from '..'
import Header, { Name, Topic } from '../../Header'
import { Wrapper } from '../../Messages/elements'

const ErrorAhoy = () => (
  <Wrapper>
    <Header>
      <Name>Error ahoy!</Name>
      <Topic>Something went wrong. Try reloading</Topic>
    </Header>
    <Error />
  </Wrapper>
)

export default ErrorAhoy
