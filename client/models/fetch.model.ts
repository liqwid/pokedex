export const MAX_ITEMS = 100

export type ConcatType = 'left' | 'right' | undefined
export const CONCAT_LEFT = 'left'
export const CONCAT_RIGHT = 'right'

/**
 * GET request query params
 */
export interface QueryParams {
  [ key: string ]: string
}

/**
 * Options for a fetch action
 */
export interface FetchOptions {
  url: string
  concatType?: string
  queryParams?: QueryParams
}

/**
 * Options for a isngile item data fetch action
 */
export interface FetchDataOptions {
  url: string
  id: number
}

/**
 * GET response for multiple items fetch
 */
export interface FetchResponse<Model> {
  result: Model[],
  nextPageUrl?: string
  previousPageUrl?: string,
  concatType?: string
}

/**
 * State params related to fetch
 */
export interface FetchableState<Model> {
  items: Model[]
  loading: boolean
  error?: string
}

/**
 * State params related to pagincation
 */
export interface PageableState {
  loadingNext: boolean
  loadingPrevious: boolean
  next?: string
  previous?: string
}

export interface FetchDataState<Model> {
  [id: string]: Model & FetchDataModel
}

/**
 * Attributes of a model to be used with fetch
 */
export interface FetchModel {
  id: number
}

export interface FetchDataModel {
  loading: boolean
  error?: string
}
