import * as React from 'react'
import { connect } from 'react-redux'

import { List } from 'components/List'
import { PokemonListItem } from 'components/PokemonListItem'
import { PageLayout } from 'components/PageLayout'

import { Pokemon } from 'models/pokemon.model'
import { createAddAction, createRemoveAction } from 'actions/favourites.actions'

export interface FavouritesListStateProps {
  favourites: Pokemon[]
}

export interface FavouritesListDispatchProps {
  addToFavourites: (pokemon: Pokemon) => any
  removeFromFavourites: (pokemon: Pokemon) => any
}

export interface FavouritesListProps extends FavouritesListStateProps, FavouritesListDispatchProps {
}

export const mapStateToProps = ({ favourites }): FavouritesListStateProps => ({ favourites })

export const mapDispatchToProps = (dispatch): FavouritesListDispatchProps => ({
  addToFavourites: (pokemon: Pokemon) => dispatch(createAddAction(pokemon)),
  removeFromFavourites: (pokemon: Pokemon) => dispatch(createRemoveAction(pokemon))
})

export function FavouritesListSFC({ favourites, removeFromFavourites, addToFavourites }: FavouritesListProps) {
  return (
    <PageLayout>
      <List
        items={favourites}
        renderChild={(pokemon: Pokemon) => {
          const { id } = pokemon
          const isFavourite = Boolean(favourites.find(({ id: itemId }) => itemId === id))
          return (
            <PokemonListItem
              key={id}
              {...pokemon}
              isFavourite={isFavourite}
              onIconClick={() => isFavourite ? removeFromFavourites(pokemon) : addToFavourites(pokemon)}
            />
          )
        }}
      />
    </PageLayout>
  )
}

export const FavouritesList = connect(mapStateToProps, mapDispatchToProps)(FavouritesListSFC)
