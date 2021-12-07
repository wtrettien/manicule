import { metadata } from '../utils/metadata'

const SET_EDITION = 'SET_EDITION'

export const setEdition = (edition) => ({
  type: SET_EDITION,
  edition,
})

export default (state = { edition: null, data: {} }, action) => {
  switch (action.type) {
    case SET_EDITION: {
      // Get the new metadata for this edition
      const pages = metadata[action.edition].pages
      const tour = metadata[action.edition].tour
      return {
        name: action.edition,
        pages,
        tour,
      }
    }

    default:
      return state
  }
}
