import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import { fetchPokemonData } from 'actions/pokemon.actions'
import { Pokemon } from 'models/pokemon.model'
import { FetchDataModel } from 'models/fetch.model'

import { PageLayout } from 'components/PageLayout'
import { Loader } from 'components/Loader'
import { PokemonData } from 'components/PokemonData'

export interface PokemonDispatchProps {
  fetchPokeData: (id: number) => any
}

export interface PokemonStateProps extends Partial<FetchDataModel & Pokemon> {}

export interface PokemonProps extends PokemonStateProps, PokemonDispatchProps, RouteComponentProps<{ id: string }> {
}

export const ERROR_TEXT = 'Wasted. Try again'

export const mapStateToProps = ({ pokemonData, favourites }, { match: { params: { id }}}): PokemonStateProps =>
  pokemonData[id] || { id, loading: true, error: undefined }

export const mapDispatchToProps = (dispatch): PokemonDispatchProps => ({
  fetchPokeData: (id: number) => dispatch(fetchPokemonData(id))
})

export class PokemonPageContainer extends React.Component<PokemonProps> {
  componentDidMount() {
    const { id, fetchPokeData } = this.props
    fetchPokeData(Number(id))
  }
  
  render() {
    const { error, loading, fetchPokeData, ...pokemonProps } = this.props

    return (
      <PageLayout>
        { loading && <Loader/> }
        { error && ERROR_TEXT }
        { !loading && !error && <PokemonData {...pokemonProps} /> }
      </PageLayout>
    )
  }
}

export const PokemonPage = connect(mapStateToProps, mapDispatchToProps)(PokemonPageContainer)
