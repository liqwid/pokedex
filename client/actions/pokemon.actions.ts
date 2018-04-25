import { formatQueryParams } from 'services/queryParams'
import { createFetchAction, createFetchDataAction, FETCH, FETCH_DATA, FETCH_NEXT_PAGE,
  FETCH_PREVIOUS_PAGE, SEARCH } from 'actions/fetch.actions'
import { FetchOptions } from 'models/fetch.model'
import { POKEMON_SCOPE, POKEMON_ENDPOINT, POKEMON_DATA_ENDPOINT } from 'models/pokemon.model'

export function fetchPokemon(options?: FetchOptions) {
  return createFetchAction(FETCH, { url: POKEMON_ENDPOINT, ...options }, POKEMON_SCOPE)
}

export function fetchPokemonNextPage(options?: Partial<FetchOptions>) {
  return createFetchAction(FETCH_NEXT_PAGE, { url: POKEMON_ENDPOINT, concatType: 'right', ...options }, POKEMON_SCOPE)
}

export function fetchPokemonPreviousPage(options?: Partial<FetchOptions>) {
  return createFetchAction(
    FETCH_PREVIOUS_PAGE, { url: POKEMON_ENDPOINT, concatType: 'left', ...options }, POKEMON_SCOPE
  )
}

export function searchPokemon({ queryParams, ...options }: Partial<FetchOptions>) {
  return createFetchAction(
    SEARCH, { url: POKEMON_ENDPOINT + formatQueryParams(queryParams), ...options }, POKEMON_SCOPE
  )
}

export function fetchPokemonData(id: number) {
  const url = POKEMON_DATA_ENDPOINT + id
  return createFetchDataAction(FETCH_DATA, { id, url }, POKEMON_SCOPE)
}
