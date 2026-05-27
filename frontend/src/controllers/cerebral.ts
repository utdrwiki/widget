import {
  ConnectFactory,
  Controller,
  Dictionary,
  IBranchContext,
  IContext,
  Module
} from '@cerebral/fluent'
import { Signals, State } from '../store/types'
import * as signals from '../store/sequences'

interface Providers {
  state: State
}

const module = Module({
  state: {
    loading: true,
    channel: {
      category: '',
      id: '',
      name: '',
      permissions: [],
      type: 0,
      unread: false,
      lastSeenID: ''
    },
    messages: Dictionary({}),
    messageQueue: [],
    modal: {
      open: false,
      type: '',
      data: null
    },
    user: {
      avatar: '',
      id: '',
      name: '',
      type: 'guest'
    }
  },
  signals
})

export type Context<Props = {}> = IContext<Props> & Providers

export type BranchContext<Paths, Props = {}> = IBranchContext<Paths, Props> &
  Providers

export const connect = ConnectFactory<State, Signals>()

const controller = Controller<State, Signals>(module)

export default controller
