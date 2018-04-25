import { Reducer } from 'redux'
import { createReducer } from 'reducers/createReducer'

import { FetchModel, FetchDataState } from 'models/fetch.model'

import { FETCH_DATA, UPDATE_DATA, DATA_ERROR } from 'actions/fetch.actions'

export interface FetchReducerParams<InitialState> {
  scope?: string,
  initialState?: InitialState,
  handlers?: { [key: string]: Reducer<InitialState> },
}

export function createFetchDataReducer<Model extends FetchModel, InitialState = {}>(
  { scope, initialState, handlers }: FetchReducerParams<InitialState>
): Reducer<FetchDataState<Model> & InitialState> {
  const INITIAL_STATE = {}
  const initialItemState = {
    loading: true,
    error: undefined
  }

  const fetchHandlers: { [key: string]: Reducer } = {
    /**
     * Initiates an item fetch
     */
    [FETCH_DATA]: (state, options) => ({
      ...state,
      [options.id]: initialItemState
    }),

    /**
     * Updates item data
     */
    [UPDATE_DATA]: (state, result) => ({
      ...state,
      [result.id]: {
        loading: false,
        error: undefined,
        ...result,
      }
    }),

    /**
     * Updates item fetch error data
     */
    [DATA_ERROR]: (state, { error, id }) => ({
      ...state,
      [id]: {
        ...state.id,
        loading: false,
        error,
      }
    }),
  }
  
  return createReducer(
    { ...INITIAL_STATE, ...<any> initialState },
    { ...fetchHandlers, ...handlers },
    scope
  )
}
