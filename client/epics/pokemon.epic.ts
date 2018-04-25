import { AjaxResponse } from 'rxjs/ajax'

import { Pokemon, POKEMON_SCOPE } from 'models/pokemon.model'
import { createFetchEpic } from 'epics/fetch.epic'
import { createFetchDataEpic } from 'epics/fetchData.epic'

function parsePokemon({ url, name }: Pokemon) {
  const id = url.replace(/https:\/\/pokeapi\.co\/api\/v2\/pokemon\/(\d*)\//, ($all, $id) => $id)
  const avatarUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  return { url, name, id, avatarUrl }
}

function parseResponse(res: AjaxResponse) {
  return {
    ...res,
    response: {
      ...res.response,
      results: res.response.results.map(parsePokemon)
    }
  }
}

export const fetchPokemonEpic = createFetchEpic<Pokemon>({ scope: POKEMON_SCOPE, parseResponse })
export const fetchPokemonDataEpic = createFetchDataEpic<Pokemon>({ scope: POKEMON_SCOPE })
