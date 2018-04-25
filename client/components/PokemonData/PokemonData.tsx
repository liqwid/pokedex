import * as React from 'react'

import styled from 'styled-components'

import Typography from 'material-ui/Typography'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { List, ListItem, ListItemText } from 'material-ui'
import Collapse from 'material-ui/transitions/Collapse'

import { BigAvatar } from 'components/Avatar'

const AvatarsWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const NestedListItem = styled(ListItem)`
  padding-left: 16px !important;
`

export interface PokemonDataState {
  statsOpen: boolean
  abilitiesOpen: boolean
  movesOpen: boolean
}

export class PokemonData extends React.Component<any, PokemonDataState> {
  state = {
    statsOpen: false,
    abilitiesOpen: false,
    movesOpen: false,
  }

  toggleStatsOpen = () => {
    this.setState({ statsOpen: !this.state.statsOpen })
  }

  toggleAbilitiesOpen = () => {
    this.setState({ abilitiesOpen: !this.state.abilitiesOpen })
  }

  toggleMovesOpen = () => {
    this.setState({ movesOpen: !this.state.movesOpen })
  }
  
  render( ) {
    const { name, moves, abilities, stats, sprites } = this.props
    const { statsOpen, movesOpen, abilitiesOpen } = this.state
    return (
      <div>
        <Typography gutterBottom={true} align='center' variant='display2'>
          {name}
        </Typography>
        <AvatarsWrap>
          {
            Object.values(sprites).filter(Boolean).reverse()
            .map((url: string) => <BigAvatar key={url} alt={name} src={url} />)
          }
        </AvatarsWrap>
        <List>
          <ListItem button={true} onClick={this.toggleStatsOpen}>
            <ListItemText primary='Stats' />
            {statsOpen ? <ExpandLess color='primary'/> : <ExpandMore color='primary'/>}
          </ListItem>
          <Collapse in={statsOpen} timeout='auto' unmountOnExit={true}>
            <List component='div' disablePadding={true}>
              { stats.map(({ stat, base_stat }): any => (
                <NestedListItem key={stat.name} button={true}>
                  <ListItemText inset={true} primary={`${stat.name}: ${ base_stat }`} />
                </NestedListItem>
              ) )}
            </List>
          </Collapse>
          <ListItem button={true} onClick={this.toggleAbilitiesOpen}>
            <ListItemText primary='Abilities' />
            {abilitiesOpen ? <ExpandLess color='primary'/> : <ExpandMore color='primary'/>}
          </ListItem>
          <Collapse in={abilitiesOpen} timeout='auto' unmountOnExit={true}>
            <List component='div' disablePadding={true}>
              { abilities.map(({ ability }): any => (
                <NestedListItem key={ability.name} button={true}>
                  <ListItemText inset={true} primary={`${ability.name}`} />
                </NestedListItem>
              ) )}
            </List>
          </Collapse>
          <ListItem button={true} onClick={this.toggleMovesOpen}>
            <ListItemText primary='Moves' />
            {movesOpen ? <ExpandLess color='primary'/> : <ExpandMore color='primary'/>}
          </ListItem>
          <Collapse in={movesOpen} timeout='auto' unmountOnExit={true}>
            <List component='div'>
              { moves.map(({ move }): any => (
                <NestedListItem key={move.name} button={true}>
                  <ListItemText inset={true} primary={`${move.name}`} />
                </NestedListItem>
              ) )}
            </List>
          </Collapse>
        </List>
      </div>
    )
  }
}
