import * as React from 'react'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { Router, Route, Switch, Redirect } from 'react-router'

import styled from 'styled-components'

import { MuiThemeProvider } from 'material-ui/styles'
import CssBaseline from 'material-ui/CssBaseline'

import { theme } from 'styles/theme'

import { store, persistor } from 'store'
import { history } from 'services/history'

import { PokemonList } from 'containers/PokemonList'
import { BottomNav } from 'containers/BottomNav'
import { FavouritesList } from 'containers/FavouritesList'
import { PokemonPage } from 'containers/PokemonPage'

import '__mocks__/backend'

const LayoutWrapper = styled.div`
  height: 100%;
`

export interface UsersSearchProps {}

export default function UsersSearch(props: UsersSearchProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router history={history}>
            <LayoutWrapper>
              <Switch>
                <Route
                  path='/pokedex'
                  component={PokemonList}
                />
                <Route
                  path='/pokemon/:id'
                  component={PokemonPage}
                />
                <Route
                  path='/myPokemon'
                  component={FavouritesList}
                />
                <Redirect to='/pokedex'/>
              </Switch>
              <BottomNav/>
            </LayoutWrapper>
          </Router>
        </PersistGate>
      </Provider>
    </MuiThemeProvider>
  )
}
