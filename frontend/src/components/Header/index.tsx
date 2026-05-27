import { connect } from '../../controllers/cerebral'
import * as React from 'react'

import { Root } from './elements'

export default connect()
  .with(() => ({}))
  .to(({ children }) => (
    <Root className="header">
      {children}
    </Root>
  ))

export { Name, Topic } from './elements'
