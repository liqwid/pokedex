import { sync } from './db'
import { Pokemon } from '../models/pokemon.model'

import mock, { MockResponse, proxy } from 'xhr-mock'

const LIMIT = 20

mock.setup()

const getNextPageUrl = (originalUrl, query, pokemon, prevTo, limit) => {
  const fromId = prevTo
  if (fromId >= pokemon.length - 1) return null
  
  return `${originalUrl}?${formatQuery({ ...query, fromId, limit })}`
}

const getPreviousPageUrl = (originalUrl, query, pokemon, prevFrom, limit) => {
  const toId = prevFrom
  if (toId <= 0) return null
  
  return `${originalUrl}?${formatQuery({ ...query, toId, limit })}`
}

type ResParams = {
  res: MockResponse
  pokemon: Pokemon[]
  url?: string
  search?: string
  from?: number
  to?: number
  limit?: number
}

const formatRes = ({
  res, pokemon, url = baseUrl, search = '', from = 0, to, limit = LIMIT
}: ResParams) => {
  const searchResult = pokemon.filter(({ name, id }) => (search ? name.indexOf(search) > -1 : true))
  const result = searchResult.filter(({id}) =>
    (from ? id >= from : true)
    && (to ? id < to : true)
  )
  const limitedResult = (to && !from) ? result.slice(-LIMIT) : result.slice(0, LIMIT)
  const toItem = limitedResult[limitedResult.length - 1]
  const fromItem = limitedResult[0]
  if (!to) to = toItem ? (toItem.id + 1) : searchResult.length - 1
  if (!from) from = fromItem ? fromItem.id : 0

  res.body({
    results: limitedResult,
    next: getNextPageUrl(baseUrl, { searchTerm: search }, searchResult, to, limit),
    previous: getPreviousPageUrl(baseUrl, { searchTerm: search }, searchResult, from, limit)
  })

  return res
}

const formatQuery = (query) => Object.keys(query)
  .map((key) => `${key}=${query[key]}`).join('&')

const baseUrl = '/api/pokemon'

mock.get(/\/api\/pokemon.*/, async (req, res) => {
  const pokemon = await sync()
  const { query, path } = req.url()
  const { searchTerm, fromId, toId, limit } = <{ [key: string]: string }>query

  return formatRes({
    url: path,
    res,
    pokemon,
    search: searchTerm,
    limit: Number(limit) || undefined,
    from: Number(fromId) || undefined,
    to: Number(toId) || undefined
  })
})

mock.use(proxy)
