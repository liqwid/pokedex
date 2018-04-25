import { Reducer } from 'redux'
import { PageableState, FetchableState, FetchModel,
  MAX_ITEMS, ConcatType, CONCAT_LEFT, CONCAT_RIGHT } from 'models/fetch.model'
import { createReducer } from 'reducers/createReducer'

import { FETCH, FETCH_NEXT_PAGE, FETCH_PREVIOUS_PAGE, SEARCH, UPDATE, ERROR } from 'actions/fetch.actions'

export interface FetchReducerParams<InitialState> {
  scope?: string,
  initialState?: InitialState,
  handlers?: { [key: string]: Reducer<InitialState> },
}

/**
 * Concats items, used for loading on scroll
 * Removes least recent loaded items that exceed MAX_ITEMS limit
 * @param concatType left concat, right concat or none of them for full replace
 * @param initial inital items
 * @param update updated items
 * @returns resulting items
 */
export function concatItems<Model extends FetchModel>(
  concatType: ConcatType, initial: Model[], update: Model[]
): Model[] {
  if (concatType === CONCAT_LEFT) return update.concat(initial).slice(0, MAX_ITEMS)
  if (concatType === CONCAT_RIGHT) return initial.concat(update).slice(-MAX_ITEMS)
  return update
}

/**
 * Updates next
 * Used for concating items(when next update is not needed)
 * and for excluding exceeding items (when next should be formed on client)
 * @param items new items
 * @param concatType
 * @param next next acquired from request
 * @param state previous state
 * @returns updated next
 */
export function updatenext<Model extends FetchModel>(
  items: Model[],
  concatType: ConcatType,
  next: string,
  state: FetchableState<Model> & PageableState
): string | undefined {
    if (concatType === 'left') {
      // If concat overflows MAX_ITEMS
      // reformatting next to contain overflowing items
      const stateItemsLength = state.items.length
      const overflowingItemIndex = stateItemsLength + items.length - MAX_ITEMS
      if (overflowingItemIndex > 0) {
        const fromIndex =  Number(state.items[stateItemsLength - overflowingItemIndex].id) - 1
        const toIndex = Number(state.items[stateItemsLength - 1].id) - 1
        return next
          .replace(/(fromId=)\d*/, ($0, $1) => $1 + fromIndex)
          .replace(/(toId=)\d*/, ($0, $1) => $1 + toIndex)
      }
      // Do not update next page url upon previous page concat
      return state.next
    }
    
    return next
}

/**
 * Updates previous
 * Used for concating items(when previous update is not needed)
 * and for excluding exceeding items (when next should be formed on client)
 * @param items new items
 * @param concatType
 * @param previous previous acquired from request
 * @param state previous state
 * @returns updated previous
 */
export function updateprevious<Model extends FetchModel>(
  items: Model[],
  concatType: ConcatType,
  previous: string,
  state: FetchableState<Model> & PageableState
) {
    if (concatType === 'right') {
      // If concat overflows MAX_ITEMS
      // reformatting previous to contain overflowing items
      const overflowingItemIndex = state.items.length + items.length - MAX_ITEMS
      if (overflowingItemIndex > 0) {
        const fromIndex = Number(state.items[0].id) - 1
        const toIndex = Number(state.items[overflowingItemIndex].id) - 1
        return previous
          .replace(/(fromId=)\d*/, ($0, $1) => $1 + fromIndex)
          .replace(/(toId=)\d*/, ($0, $1) => $1 + toIndex)
      }
      // Do not update previous page url upon next page concat
      return state.previous
    }
    
    return previous
}

/**
 * Creates reducer with fetch state params: loading, pagination, items list
 * @param initialState 
 * @param handlers 
 */
export function createFetchReducer<Model extends FetchModel, InitialState = {}>(
  { scope, initialState, handlers }: FetchReducerParams<InitialState>
): Reducer<FetchableState<Model> & PageableState & InitialState> {
  const INITIAL_FETCH_STATE: FetchableState<Model> & PageableState = {
    items: [],
    loading: true,
    loadingPrevious: false,
    loadingNext: false,
    error: undefined
  }

  const fetchHandlers: { [key: string]: Reducer } = {
    /**
     * Initiates a full refetch
     */
    [FETCH]: (state) => ({
      ...state,
      loading: true,
      loadingPrevious: false,
      loadingNext: false,
      error: undefined,
    }),

    /**
     * Initiates next page fetch
     */
    [FETCH_NEXT_PAGE]: (state) => ({
      ...state,
      loading: false,
      loadingPrevious: false,
      loadingNext: true,
      error: undefined,
    }),

    /**
     * Initiates previous page fetch
     */
    [FETCH_PREVIOUS_PAGE]: (state) => ({
      ...state,
      loading: false,
      loadingPrevious: true,
      loadingNext: false,
      error: undefined,
    }),
    
    /**
     * Initiates search
     */
    [SEARCH]: (state) => ({
      ...state,
      loading: false,
      loadingPrevious: false,
      loadingNext: true,
      error: undefined,
    }),
        
    /**
     * Updates collection with fetch results
     */
    [UPDATE]: (state, { results, next, previous, concatType }) => ({
      ...state,
      loading: false,
      loadingPrevious: false,
      loadingNext: false,
      error: undefined,
      items: concatItems<Model>(concatType, state.items, results) || [],
      next: next ? updatenext<Model>(results, concatType, next, state) : '',
      // Do not update previous page url upon next page concat
      previous: previous ? updateprevious<Model>(results, concatType, previous, state) : '',
    }),
        
    /**
     * Sets error info
     */
    [ERROR]: (state, { error }) => ({
      ...state,
      loading: false,
      loadingPrevious: false,
      loadingNext: false,
      error,
    }),
  }

  return createReducer(
    { ...INITIAL_FETCH_STATE, ...<any> initialState },
    { ...fetchHandlers, ...handlers },
    scope
  )
}
