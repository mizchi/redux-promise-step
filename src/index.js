/* @flow */
const createCommitFunc = dispatch => async action => {
  dispatch(action)
  const promise =
    action instanceof Promise
      ? action
      : action.payload instanceof Promise ? action.payload : Promise.resolve()
  return promise
}

export const createStepAction = fn => {
  return dispatch => fn(createCommitFunc(dispatch))
}
