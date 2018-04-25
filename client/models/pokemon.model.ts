import { PageableState, FetchableState } from 'models/fetch.model'

export interface Pokemon {
  name: string
  url: string
  id: number
  avatarUrl: string
}

export type PokemonState = FetchableState<Pokemon> & PageableState

export const POKEMON_SCOPE = 'POKEMON'

export const POKEMON_DATA_ENDPOINT = 'https://pokeapi.co/api/v2/pokemon/'
export const POKEMON_ENDPOINT = '/api/pokemon'
