import { createFetchReducer } from 'reducers/fetch.reducer'
import { createFetchDataReducer } from 'reducers/fetchData.reducer'

import { Pokemon, POKEMON_SCOPE } from 'models/pokemon.model'

export const pokemon = createFetchReducer<Pokemon>({ scope: POKEMON_SCOPE })
export const pokemonData = createFetchDataReducer<Pokemon>({ scope: POKEMON_SCOPE })
