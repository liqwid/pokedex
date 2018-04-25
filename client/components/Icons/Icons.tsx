import * as React from 'react'

const pokeball = require('./pokeball.png')
const pokedex = require('./pokedex.png')
const star = require('./star-pokemon.png')
const starGreen = require('./star-pokemon-green.png')

export const Pokeball = () => <img src={pokeball}/>
export const Pokedex = () => <img src={pokedex}/>
export const Star = () => <img src={star} height={25}/>
export const GreenStar = () => <img src={starGreen} height={25}/>
