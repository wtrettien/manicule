
const SET_TOUR_ITEM = 'SET_TOUR_ITEM'

export const setTourItem = (item, side) => ({
  type: SET_TOUR_ITEM,
  item,
  side,
})

export default (state = { item: null, side: null }, action) => {
  switch (action.type) {
    case SET_TOUR_ITEM: {
      return {
        side: action.side,
        item: action.item,
      }
    }
    default:
      return state
  }
}
