# redux-promise-step

WIP

```sh
npm install redux-promise-step -S
# or
yarn add redux-promise-step
```

## Examples

Setup store with redux-thunk and redux-promise. (I will remove these dependencies latter)

```js
/* @flow */
import reduxPromise from 'redux-promise'
import reduxThunk from 'redux-thunk'
import reduxLogger from 'redux-logger' // for debug
import { applyMiddleware, createStore } from 'redux'
import reducer from './reducers/progress'

export default createStore(
  reducer,
  undefined,
  applyMiddleware(reduxPromise, reduxThunk, reduxLogger)
)
```

Run

```js
/* @flow */
import { start, progress, end } from './reducers/progress'
import store from './store'

// helper
const wait = ms => new Promise(fullfill => setTimeout(fullfill, ms))

store.dispatch(
  createStepAction(async commit => {
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
```

## TODO

* Remove dependencies

## LICENSE

MIT
