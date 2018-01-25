# redux-promise-step

WIP

```sh
npm install redux-promise-step -S
# or
yarn add redux-promise-step
```

## Examples

Setup store with middleware.

```js
/* @flow */
import { applyMiddleware, createStore } from 'redux'
import reduxPromise from 'redux-promise'
import { middleware as reduxPromiseSteps } from 'redux-promise-steps'
import reducer from './reducers'

export default createStore(
  reducer,
  undefined,
  applyMiddleware(reduxPromiseSteps(reduxPromise))
)
```

Run

```js
/* @flow */
import { start, progress, end } as ProgressActions from './reducers/progress'
import store from './store'
import { run, bindActionsToCommits } from 'redux-promise-step'

// helper
const wait = ms => new Promise(fullfill => setTimeout(fullfill, ms))

store.dispatch(
  run(bindActionsToCommits({...ProgressActions}), async commits => {
    let c = 0
    await commits.start()
    while (true) {
      const addVal = Math.floor(Math.random() * 20)
      c += addVal
      if (c > 100) {
        break
      }
      await wait(addVal)
      await commits.progress(c)
    }
    await commits.end()
  })
)
```

## What is commits (Why not dispatch)

`dispatch` returns just action object.
`redux-promise-step`'s `commit` return promise to wait Promised Action: `<T> Promise<{type: string, payload: T}> | { type: string, payload: Promise<T> }`

## TODO

* Make it runnable
* Add types to flow
* Add types to typescript
* Remove dependencies (thunk)

## LICENSE

MIT
