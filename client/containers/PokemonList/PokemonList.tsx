import * as React from 'react'
import { connect } from 'react-redux'

import { Pokemon, PokemonState } from 'models/pokemon.model'
import { searchPokemon, fetchPokemon, fetchPokemonNextPage, fetchPokemonPreviousPage } from 'actions/pokemon.actions'
import { createAddAction, createRemoveAction } from 'actions/favourites.actions'

import { SearchField } from 'components/SearchField'
import { PageLayout } from 'components/PageLayout'
import { List } from 'components/List'
import { PokemonListItem } from 'components/PokemonListItem'

export interface PokemonListStateProps extends PokemonState {
  favourites: Pokemon[]
}
export interface PokemonListDispatch {
  search: (queryParams: {}) => any
  fetch: () => any
  fetchNextPage: (next?: string) => any
  fetchPreviousPage: (previous?: string) => any
  addToFavourites: (pokemon: Pokemon) => any
  removeFromFavourites: (pokemon: Pokemon) => any
}

export interface PokemonListProps extends PokemonListStateProps, PokemonListDispatch {}
export interface PokemonListState {
  searchName: string
}

export const SEARCH_PLACEHOLDER = 'Pokesearch'
export const ERROR_TEXT = 'Wasted. Try again'

const SEARCH_HEIGHT = 48

export const mapStateToProps = ({ pokemon, favourites }): PokemonListStateProps => ({ ...pokemon, favourites })

export const mapDispatchToProps = (dispatch): PokemonListDispatch => ({
  search: (queryParams: {}) => dispatch(searchPokemon({ queryParams })),
  fetch: () => dispatch(fetchPokemon()),
  fetchNextPage: (next?: string) =>
    next && dispatch(fetchPokemonNextPage({ url: next })),
  fetchPreviousPage: (previous?: string) =>
    previous && dispatch(fetchPokemonPreviousPage({ url: previous })),
  addToFavourites: (pokemon: Pokemon) => dispatch(createAddAction(pokemon)),
  removeFromFavourites: (pokemon: Pokemon) => dispatch(createRemoveAction(pokemon))
})

export class PokemonListContainer extends React.Component<PokemonListProps, PokemonListState> {
  container: HTMLDivElement
  
  state = {
    searchName: ''
  }

  componentDidMount() {
    this.fetchPokemon()
  }

  search = ({ target: { value }}: React.ChangeEvent<any>) => {
    const { search } = this.props
    this.setState({ searchName: value })
    search({ searchTerm: value })
  }

  filterPokemon(items: Pokemon[]) {
    const { searchName } = this.state
    return items.filter(({ name }) => name.indexOf(searchName) > -1)
  }

  fetchPokemon() {
    this.props.fetch()
  }
  
  render() {
    const { searchName } = this.state
    const { items, loading, loadingNext, loadingPrevious, error, fetchNextPage, fetchPreviousPage,
      next, previous, addToFavourites, removeFromFavourites, favourites } = this.props
    const itemsProps = {
      items: this.filterPokemon(items),
      loading, loadingNext, loadingPrevious, error
    }
    return (
      <PageLayout ref={(node) => { this.container = node }}>
        <SearchField
          style={{ height: SEARCH_HEIGHT }}
          value={searchName}
          onChange={this.search}
          autoFocus={true}
          placeholder={SEARCH_PLACEHOLDER}
        />
        { error && ERROR_TEXT }
        {
          !error && <List
            style={{ height: `calc(100% - ${SEARCH_HEIGHT}px)` }}
            {...itemsProps}
            onScrollPastTop={() => fetchPreviousPage(previous)}
            onScrollPastBottom={() => fetchNextPage(next)}
            renderChild={(pokemon: Pokemon) => {
              const { id } = pokemon
              const isFavourite = Boolean(favourites.find(({ id: itemId }) => itemId === id))
              return (<PokemonListItem
                key={id}
                {...pokemon}
                isFavourite={isFavourite}
                onIconClick={() => isFavourite ? removeFromFavourites(pokemon) : addToFavourites(pokemon)}
              />)
            }}
          />
        }
      </PageLayout>
    )
  }
}

export const PokemonList = connect(mapStateToProps, mapDispatchToProps)(PokemonListContainer)
