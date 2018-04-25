import * as React from 'react'

import { ListItemText, ListItem, ListItemSecondaryAction } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'

import { Star, GreenStar } from 'components/Icons'
import { Link } from 'components/Link'
import { MediumAvatar } from 'components/Avatar'

import { Pokemon } from 'models/pokemon.model'

export interface PokemonListItemProps extends Pokemon {
  isFavourite: boolean
  onIconClick(): void
}

export function PokemonListItem({ id, name, avatarUrl, isFavourite, onIconClick }: PokemonListItemProps) {
  return (
    <Link to={`/pokemon/${id}`}>
      <ListItem button={true}>
        <MediumAvatar alt={name} src={avatarUrl} />
        <ListItemText primary={name} />
        <ListItemSecondaryAction>
          <IconButton
            onClick={(e) => {
              e.preventDefault()
              onIconClick()
            }}
          >
            {isFavourite ? <GreenStar/> : <Star/>}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </Link>
  )
}
