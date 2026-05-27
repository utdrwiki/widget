import * as React from 'react'
import chat from 'react-icons/lib/md/chat'
import error from 'react-icons/lib/md/error'
import off from 'react-icons/lib/md/visibility-off'

import { Wrap } from './elements'
import loading from './Loading'

export const Loading = Wrap(loading)

export const Chat = Wrap(chat)

export const Error = Wrap(error)

export const NoMessages = Wrap(off)
