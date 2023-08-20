import { atom } from 'recoil'
import type { Direction } from '../variables'
import { variables } from '../variables'
import { effects } from './effects'

export const lat = atom<string>({
  key: 'url.lat',
  default: `${variables.center[0]}`,
  effects: [effects.urlHashPersistence(variables.urlHashKeys[1])],
})

export const lon = atom<string>({
  key: 'url.lon',
  default: `${variables.center[1]}`,
  effects: [effects.urlHashPersistence(variables.urlHashKeys[2])],
})

export const zoom = atom<string>({
  key: 'url.zoom',
  default: `${variables.zoom}`,
  effects: [effects.urlHashPersistence(variables.urlHashKeys[0])],
})

export const direction = atom<Direction>({
  key: 'url.direction',
  default: 'driving-car',
})

export const start = atom<string>({
  key: 'url.start',
  default: undefined,
})

export const end = atom<string>({
  key: 'url.end',
  default: undefined,
})

export const url = { lat, lon, zoom, direction, start, end }
