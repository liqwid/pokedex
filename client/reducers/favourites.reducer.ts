import { Reducer } from 'redux'
import { createReducer } from 'reducers/createReducer'

import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from 'actions/favourites.actions'

const initialState = []

const favouritesHandlers: { [key: string]: Reducer } = {
  /**
   * Adds item to favourites
   */
  [ADD_TO_FAVOURITES]: (state, item) => state.filter(({ id }) => item.id !== id).concat(item),

  /**
   * Removes item to favourites
   */
  [REMOVE_FROM_FAVOURITES]: (state, item) => state.filter(({ id }) => item.id !== id),
}

export const favourites = createReducer(
  initialState,
  favouritesHandlers,
)
