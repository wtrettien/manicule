
const SET_TOUR_INDEX = 'SET_TOUR_INDEX'

export const setTourIndex = (index, side) => ({
  type: SET_TOUR_INDEX,
  index,
  side,
})

export default (state = { index: null, side: null }, action) => {
  switch (action.type) {
    case SET_TOUR_INDEX: {
      return {
        side: action.side,
        index: action.index,
      }
    }
    default:
      return state
  }
}
