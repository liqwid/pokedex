import { Pokemon } from '../models/pokemon.model'

export function sync(): Promise<Pokemon[]> {
  let cachedDb: Pokemon[]
  try {
    cachedDb = JSON.parse(localStorage.getItem('cachedDb') || 'null')
  } finally {}
  if (cachedDb) return Promise.resolve(<Pokemon[]> cachedDb)
  
  return fetch('https://pokeapi.co/api/v2/pokemon/?limit=1000')
  .then((response) => response.json())
  .then(({ results }) => results.map((result, id) => ({ id, ...result })))
  .then((results) => {
    localStorage.setItem('cachedDb', JSON.stringify(results))
    return results
  })
}
