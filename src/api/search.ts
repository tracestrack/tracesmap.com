import { constants } from '../constants'
import type { SearchServiceKey } from '../variables'

// https://nominatim.org/release-docs/develop/api/nominatim

export interface SearchParams {
  q?: string // query
  amenity?: string // name and/or type of POI
  street?: string // housenumber streetname
  city?: string // city
  county?: string // county
  state?: string // state
  country?: string // country
  postalcode?: string // postalcode
  format?: string
}

export interface SearchReturn {
  address?: {
    bakery?: string
    city?: string
    continent?: string
    country?: string
    footway?: string
    neighbourhood?: string
    postcode?: number
    state?: string
    suburb?: string
  }
  boundingbox?: number[]
  class?: string
  display_name?: string
  icon?: string
  importance?: number
  lat?: number
  licence?: string
  lon?: number
  osm_id?: number
  osm_type?: string
  place_id?: number
  type?: string
}

export async function search(o: SearchParams, s: SearchServiceKey = 'openstreetmap'): Promise<SearchReturn[]> {
  try {
    let u = ''
    if (s === 'openstreetmap') u = constants.SEARCH_API_URL_OPENSTREETMAP.replace('{q}', o.q)
    if (s === 'tomtom') u = constants.SEARCH_API_URL_TOMTOM.replace('{q}', o.q)
    if (u === '') throw new Error('unkown search api url')

    const url = new URL(u)
    if (o) for (const k in o) url.searchParams.append(k, o[k])
    const res = await fetch(url.toString(), { method: 'GET' })
    const d = await res.json()
    if (s === 'openstreetmap')
      return d.map(v => ({
        display_name: v.display_name,
        source: 'osm',
        data: v,
        position: [parseFloat(v.lat), parseFloat(v.lon)],
        viewport: [
          [v.boundingbox[0], v.boundingbox[2]].map(v => parseFloat(v)),
          [v.boundingbox[1], v.boundingbox[3]].map(v => parseFloat(v)),
        ],
      }))
    if (s === 'tomtom')
      return d.results.map(v => ({
        display_name: v.address.freeformAddress,
        source: 'tomtom',
        data: v,
        position: [v.position.lat, v.position.lon],
        viewport: [
          [v.viewport.btmRightPoint.lat, v.viewport.btmRightPoint.lon],
          [v.viewport.topLeftPoint.lat, v.viewport.topLeftPoint.lon],
        ],
      }))
  } catch (e) {
    console.error(e)
  }
}

export type Search = typeof search
