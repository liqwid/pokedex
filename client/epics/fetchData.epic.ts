import { Store } from 'redux'
import { ofType, Epic } from 'redux-observable'

import { of } from 'rxjs'
import { AjaxResponse } from 'rxjs/ajax'
import { filter, mergeMap, map, tap, catchError } from 'rxjs/operators'

import restApi from 'services/restApi'
import { FETCH_DATA, UPDATE_DATA, DATA_ERROR, createErrorDataAction, createUpdateDataAction,
  FetchDataAction, ErrorDataAction, UpdateDataAction } from 'actions/fetch.actions'

export interface FetchEpicOptions {
  scope: string
  parseResponse?(response: AjaxResponse): AjaxResponse
}

/**
 * Creates a fetch epic that fetches single item data
 */
export function createFetchDataEpic<Model>(
  { scope, parseResponse }: FetchEpicOptions
): Epic<UpdateDataAction<Model> | ErrorDataAction | FetchDataAction, Store> {
  return (action$) => action$.pipe(
    scope ? filter((action) => action.scope === scope) : tap(),
    ofType(FETCH_DATA),
    /**
     * Cancels previous pending fetch
     */
    mergeMap(({ payload: { url, id }, type }: FetchDataAction) =>
      restApi.get({ url, cache: true }).pipe(
        parseResponse ? map(parseResponse) : tap(),
        /**
         * Triggers update action after fetch
         */
        map(({ response }: AjaxResponse) => createUpdateDataAction<Model>(UPDATE_DATA, response, scope)),
        /**
         * Triggers error action on fetch error
         */
        catchError((error) => of(createErrorDataAction(DATA_ERROR, error, id, scope)))
      )
    ),
  )
}
