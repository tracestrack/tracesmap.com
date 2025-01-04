import { constants } from '../constants'
import type { MapBaseLayer, MapLanguage, MapOverlayLayer, MapStyle } from '../variables'

export function getStyle(a: MapStyle, b: 'base' | 'lang') {
  const o: Record<MapStyle, Record<typeof b, any>> = {
    normal: {
      base: {
        exposure: 0,
        contrast: 0,
        saturation: 0,
        gamma: 1,
      },
      lang: {
        brightness: 0,
        exposure: 0,
        contrast: 0,
        saturation: 0.3,
        gamma: 1,
      },
    },
    vivid: {
      base: {
        exposure: 0,
        brightness: -0.05,
        contrast: 0.1,
        saturation: 0.3,
        gamma: 0.6,
      },
      lang: {},
    },
    grayscale: {
      base: {
        brightness: 0,
        exposure: 0,
        contrast: 0,
        saturation: -1,
        gamma: 1.1,
      },
      lang: {
        brightness: 0,
        exposure: 0,
        contrast: 0,
        saturation: -0.5,
      },
    },
    dark: {
      base: {
        brightness: 0,
        exposure: 0,
        contrast: 0,
        saturation: -1,
        gamma: 0.1,
      },
      lang: {
        brightness: 0,
        exposure: 0,
        contrast: 0,
        saturation: 0,
      },
    },
  }

  if (!a) a = 'normal'

  return o[a][b]
}

function getBaseLayerSourceUrl(s: MapBaseLayer) {
  const o: Record<typeof s, string> = {
    street: constants.STREET_SOURCE_URL,
    satellite: constants.SATELLITE_SOURCE_URL,
    topo: constants.TOPO_SOURCE_URL,
    transport: constants.TRANSPORT_SOURCE_URL,
  }

  return o[s]
}

function getOverlayLayerSourceUrl(s: MapOverlayLayer) {
  const o: Record<typeof s, string> = {
    none: '',
    traffic: constants.TRAFFIC_SOURCE_URL,
    'orm-infra': constants.ORM_INFRA_SOURCE_URL,
    'orm-speed': constants.ORM_SPEED_SOURCE_URL,
    gps: constants.GPS_SOURCE_URL,
  }

  return o[s]
}

function getLanguageLayerSourceUrl(a: MapLanguage, b: MapStyle) {
  let s = constants.LANGUAGE_SOURCE_URL.replace('{language}', a)

  const url = new URL(s)

  if (b === 'dark') url.searchParams.append('style', 'dark3')

  return decodeURI(url.toString())
}

export const map = { getStyle, getBaseLayerSourceUrl, getOverlayLayerSourceUrl, getLanguageLayerSourceUrl }
