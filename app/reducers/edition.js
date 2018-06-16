const SET_EDITION = 'SET_EDITION'

export const setEdition = (edition) => ({
  type: SET_EDITION,
  edition,
})

export default (state = 'none', action) => {
  switch (action.type) {
    case SET_EDITION:
      return action.edition
    default:
      return state
  }
}
