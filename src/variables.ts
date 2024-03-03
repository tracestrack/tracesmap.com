export const uiLanguages = ['nl-NL', 'en-US', 'fr-FR', 'zh-CN'] as const

export type UILanguage = (typeof uiLanguages)[number]

export const mapLanguages = [
  'auto-name',
  '_-name',
  'ar-name',
  'de-name',
  'en-name',
  'es-name',
  'fi-name',
  'fr-name',
  'hu-name',
  'he-name',
  'it-name',
  'ja-name',
  'ko-name',
  'nl-name',
  'uk-name',
  'pl-name',
  'pt-name',
  'ru-name',
  'sv-name',
  'tr-name',
  'th-name',
  'zh-hans-name',
  'zh-hant-name',
] as const

export const mapOverlayLayers = [
  'none',
  'bicycle',
  'subway',
  'bus',
  'train',
  'traffic',
  'orm-infra',
  'orm-speed',
  'gps',
] as const
export const mapBaseLayers = ['base', 'street', 'satellite', 'topo'] as const

export const mapStyles = ['normal', 'grayscale', 'vivid', 'dark'] as const

export type MapLanguage = (typeof mapLanguages)[number]

export type MapOverlayLayer = (typeof mapOverlayLayers)[number]

export type MapBaseLayer = (typeof mapBaseLayers)[number]

export type MapStyle = (typeof mapStyles)[number]

export const localStorageKey = {
  uiLanguage: 'ui_lang',
  mapLanguage: 'map_lang',
}

export const defaultUILanguage: UILanguage = 'en-US'
export const defaultMapLanguage: MapLanguage = 'en-name'

export const baseLayerID = 'base-layer' as const
export const overlayLayerID = 'overlay-layer' as const
export const languageLayerID = 'language-layer' as const
export const positionPointLayerID = 'position-point-layer' as const
export const directionLayerID = 'direction-layer' as const
export const searchLayerID = 'search-layer' as const
export const nearbyPlacesLayerID = 'nearby-places-layer' as const
export const poiPlacesLayerID = 'poi-places-layer' as const

const layerIDS = [baseLayerID, overlayLayerID, languageLayerID, positionPointLayerID] as const

export type layerID = (typeof layerIDS)[number]

export const urlHashKeys = ['zoom', 'lat', 'lon', 'style', 'base', 'overlay'] as const

export type URLHashKeys = (typeof urlHashKeys)[number]

export const center = [0, 0]
export const zoom = 2

export const directions = ['driving-car', 'cycling-regular', 'cycling-mountain', 'foot-walking', 'foot-hiking'] as const

export type Direction = (typeof directions)[number]

export const coordinateFixed = 6
export const distanceFixed = 2
export const durationFixed = 0

export const searchService: { key: SearchServiceKey; name: string }[] = [
  { key: 'openstreetmap', name: 'OpenStreetMap' },
  { key: 'tomtom', name: 'TomTom' },
]

export type SearchServiceKey = 'openstreetmap' | 'tomtom'

export const variables = {
  uiLanguages,
  mapLanguages,
  mapOverlayLayers,
  mapBaseLayers,
  mapStyles,
  localStorageKey,
  defaultMapLanguage,
  defaultUILanguage,

  baseLayerID,
  overlayLayerID,
  languageLayerID,
  positionPointLayerID,
  directionLayerID,
  searchLayerID,
  nearbyPlacesLayerID,
  poiPlacesLayerID,

  urlHashKeys,

  center,
  zoom,

  directions,

  coordinateFixed,
  distanceFixed,
  durationFixed,

  searchService,
}
