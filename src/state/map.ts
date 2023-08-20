import Map from 'ol/Map'
import { Coordinate } from 'ol/coordinate'
import { atom, atomFamily, selector } from 'recoil'
import type { Direction, MapBaseLayer, MapLanguage, MapOverlayLayer, MapStyle } from '../variables'
import { variables } from '../variables'
import { effects } from './effects'
import { url } from './url'

export const baseLayer = atom<MapBaseLayer>({
  key: 'map.baseLayer',
  default: variables.mapBaseLayers[1],
  effects: [effects.urlHashPersistence(variables.urlHashKeys[4])],
})

export const overlayLayer = atom<MapOverlayLayer>({
  key: 'map.overlayLayer',
  default: variables.mapOverlayLayers[1],
  effects: [effects.urlHashPersistence(variables.urlHashKeys[5])],
})

export const style = atom<MapStyle>({
  key: 'map.style',
  default: variables.mapStyles[0],
  effects: [effects.urlHashPersistence(variables.urlHashKeys[3])],
})

export const language = atom<MapLanguage>({
  key: 'map.language',
  default: variables.defaultMapLanguage,
  effects: [effects.localStoragePersistence(variables.localStorageKey.mapLanguage)],
})

export const ref = atom<Map>({
  key: 'map.ref',
  default: null,
  dangerouslyAllowMutability: true,
})

export const layerRef = atomFamily<any, string>({
  key: 'map.layerRef',
  default: null,
  dangerouslyAllowMutability: true,
})

export const currentPosition = atom<number[]>({
  key: 'map.currentPosition',
  default: undefined,
})

export const center = selector<Coordinate>({
  key: 'map.center',
  get: ({ get }) => {
    let a: Coordinate = [0, 0]

    const lat = get(url.lat)
    const lon = get(url.lon)

    if (lat && lon) a = [Number(lat), Number(lon)]

    return a
  },
  set: ({ set }, v) => {
    set(url.lat, `${v[0]}`)
    set(url.lon, `${v[1]}`)
  },
})

export const zoom = selector<number>({
  key: 'map.zoom',
  get: ({ get }) => {
    let n = variables.zoom

    const s = get(url.zoom)

    if (s) {
      const x = Number(s)
      if (typeof x === 'number') n = x
    }

    return n
  },
  set: ({ set }, v) => set(url.zoom, `${v}`),
})

export const direction = selector<Direction>({
  key: 'map.direction',
  get: ({ get }) => get(url.direction),
  set: ({ set }, v) => set(url.direction, v),
})

export const start = selector<Coordinate>({
  key: 'map.start',
  get: ({ get }) => {
    let a: Coordinate

    const s = get(url.start)

    if (s) {
      let x = s.split(',')
      if (x.length == 2) a = x.map(v => Number(Number(v).toFixed(variables.coordinateFixed)))
    }

    return a
  },
  set: ({ set }, v) => set(url.start, v === undefined ? undefined : `${v[0]},${v[1]}`),
})

export const end = selector<Coordinate>({
  key: 'map.end',
  get: ({ get }) => {
    let a: Coordinate

    const s = get(url.end)

    if (s) {
      let x = s.split(',')
      if (x.length == 2) a = x.map(v => Number(Number(v).toFixed(variables.coordinateFixed)))
    }

    return a
  },
  set: ({ set }, v) => set(url.end, v === undefined ? undefined : `${v[0]},${v[1]}`),
})

export const distance = atom<number>({
  key: 'map.direction.distance',
  default: undefined,
})

export const duration = atom<number>({
  key: 'map.direction.duration',
  default: undefined,
})

export const contextMenu = atom<{ open?: boolean; position?: { x: number; y: number } }>({
  key: 'map.contextMenuOpen',
  default: { open: false, position: undefined },
})

export const pinPosition = atom<Coordinate>({
  key: 'map.pinPosition',
  default: undefined,
})

export interface Place {
  coordinate: Coordinate
  name: string
  id: string | number
}

export const nearbyPlaces = atom<Place[]>({
  key: 'map.nearbyPlaces',
  default: [],
})

export const selectedNearbyPlace = atom<Place>({
  key: 'map.selectedNearbyPlace',
  default: null,
})

export const poiPlaces = atom<Place[]>({
  key: 'map.poiPlaces',
  default: [],
})

export const selectedPOIPlace = atom<Place>({
  key: 'map.selectedPOIPlace',
  default: null,
})

export const map = {
  baseLayer,
  overlayLayer,
  style,
  language,
  ref,
  layerRef,
  currentPosition,
  center,
  zoom,
  direction,
  start,
  end,
  distance,
  duration,
  contextMenu,
  pinPosition,
  nearbyPlaces,
  selectedNearbyPlace,
  poiPlaces,
  selectedPOIPlace,
}
