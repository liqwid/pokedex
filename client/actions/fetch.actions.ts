import { ScopedAction } from 'actions/scoped.actions'
import { FetchResponse, FetchOptions, FetchDataOptions } from 'models/fetch.model'

/**
 * Action Types
 */
export const FETCH = 'FETCH'
export const FETCH_DATA = 'FETCH_DATA'
export const FETCH_NEXT_PAGE = 'FETCH_NEXT_PAGE'
export const FETCH_PREVIOUS_PAGE = 'FETCH_PREVIOUS_PAGE'
export const SEARCH = 'SEARCH'
export const UPDATE = 'UPDATE'
export const UPDATE_DATA = 'UPDATE_DATA'
export const ERROR = 'ERROR'
export const DATA_ERROR = 'DATA_ERROR'

/**
 * Action Interfaces
 */
export interface FetchAction extends ScopedAction {
  payload: FetchOptions
}

export interface FetchUpdateAction<Model> extends ScopedAction {
  payload: FetchResponse<Model>
}

export interface ErrorAction extends ScopedAction {
  payload: Error
}

export interface FetchDataAction extends ScopedAction {
  payload: FetchDataOptions
}

export interface ErrorDataAction extends ScopedAction {
  payload: {
    error: Error,
    id: number
  }
}

export interface UpdateDataAction<Model> extends ScopedAction {
  payload: Model
}

/**
 * Action creators
 */
export function createFetchAction(type: string, options: FetchOptions, scope?: string) {
  return { type, scope, payload: options }
}

export function createUpdateAction<Model>(
  type: string, response: FetchResponse<Model>, concatType?: string, scope?: string
): FetchUpdateAction<Model> {
  return { type, scope, payload: { concatType, ...response } }
}

export function createErrorAction(type: string, error: Error, scope?: string): ErrorAction {
  return { type, scope, payload: error }
}

export function createFetchDataAction(type: string, options: FetchDataOptions, scope?: string): FetchDataAction {
  return { type, scope, payload: options }
}

export function createUpdateDataAction<Model>(type: string, response: Model, scope?: string): UpdateDataAction<Model> {
  return { type, scope, payload: response }
}

export function createErrorDataAction(type: string, error: Error, id: number, scope?: string): ErrorDataAction {
  return { type, scope, payload: { error, id } }
}
