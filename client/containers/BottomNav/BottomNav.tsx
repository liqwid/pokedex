import * as React from 'react'

import { withRouter, RouteComponentProps } from 'react-router-dom'

import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation'
import { Pokeball, Pokedex } from 'components/Icons'

interface BottomNavProps {}
interface BottomNavState {}

export class BottomNavComponent extends React.Component<BottomNavProps & RouteComponentProps<{}>, BottomNavState> {
  handleChange = (event: React.ChangeEvent<{}>, selected: string) => {
    this.props.history.push(`/${selected}`)
  }

  render() {
    const { location } = this.props
    const selected = location.pathname.replace(/\/([^\/]+)(\/|$)/, ($0, $1) => $1)

    return (
      <BottomNavigation value={selected} onChange={this.handleChange}>
        <BottomNavigationAction style={{ minWidth: 0 }} label='My pokemon' value='myPokemon' icon={<Pokeball />}/>
        <BottomNavigationAction style={{ minWidth: 0 }} label='Pokedex' value='pokedex' icon={<Pokedex />}/>
      </BottomNavigation>
    )
  }
}

export const BottomNav = withRouter(BottomNavComponent)
