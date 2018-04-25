import { FavouriteModel } from 'models/favourites.model'

/**
 * Action Types
 */
export const ADD_TO_FAVOURITES = 'ADD_TO_FAVOURITES'
export const REMOVE_FROM_FAVOURITES = 'REMOVE_FROM_FAVOURITES'

/**
 * Action creators
 */
export function createAddAction(item: FavouriteModel) {
  return { type: ADD_TO_FAVOURITES, payload: item }
}
export function createRemoveAction(item: FavouriteModel) {
  return { type: REMOVE_FROM_FAVOURITES, payload: item }
}
