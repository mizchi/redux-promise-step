/* @flow */
import assert from 'assert'
import reduxPromise from 'redux-promise'
import reduxThunk from 'redux-thunk'
import { applyMiddleware, createStore } from 'redux'
import { buildActionCreator, createReducer } from 'hard-reducer'
import run from '../'

// lib
const createCommitFunc = dispatch => async action => {
  dispatch(action)
  const promise =
    action instanceof Promise
      ? action
      : action.payload instanceof Promise ? action.payload : Promise.resolve()
  return promise
}

const createStepAction = fn => {
  return dispatch => fn(createCommitFunc(dispatch))
}

const { createAction, createPromiseAction } = buildActionCreator()

// actions and reducer
const start = createAction('start')
const progress = createAction('progress', (val: number) => val)
const end = createAction('end')

const r = createReducer({ currentValue: 0, onProgress: false })
  .case(start, () => {
    return { onProgress: true, currentValue: 0 }
  })
  .case(progress, (state, payload) => {
    return { onProgress: true, currentValue: payload }
  })
  .case(end, () => {
    return { onProgress: false, currentValue: 1000 }
  })

// store
const store = createStore(
  r,
  undefined,
  applyMiddleware(reduxPromise, reduxThunk)
)
store.subscribe(() => {
  console.log('update', store.getState())
})

const wait = ms => new Promise(fullfill => setTimeout(fullfill, ms))

store.dispatch(
  run(async commit => {
    let c = 0
    await commit(start())
    while (true) {
      const addVal = Math.floor(Math.random() * 200)
      c += addVal
      if (c > 1000) {
        break
      }
      await wait(addVal)
      await commit(progress(c))
    }
    await commit(end())
  })
)
