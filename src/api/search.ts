import { constants } from '../constants'
import type { SearchServiceKey } from '../variables'
import { z } from 'zod'

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

const suggestionPlaceType = z.enum(['openstreetmap', 'tomtom'])
type SuggestionPlaceType = z.infer<typeof suggestionPlaceType>

const suggestionPlace = z.object({
  id: z.string(),
  address: z
    .object({
      city: z.string().optional(),
      country: z.string().optional(),
      postcode: z.string().optional(),
      province: z.string().optional(),
      district: z.string().optional(),
      street: z.string().optional(),
      state: z.string().optional(),
    })
    .optional(),
  boundingbox: z.array(z.string()).optional(),
  name: z.string(),
  lat: z.string(),
  lon: z.string(),
  type: suggestionPlaceType,
})

export type SuggestionPlace = z.infer<typeof suggestionPlace>

const suggestionPlaces = z.array(suggestionPlace)

export type SuggestionPlaces = z.infer<typeof suggestionPlaces>

export async function search(o: SearchParams, s: SearchServiceKey = 'openstreetmap'): Promise<SuggestionPlaces> {
  try {
    let u = ''
    if (s === suggestionPlaceType.enum.openstreetmap) u = constants.SEARCH_API_URL_OPENSTREETMAP.replace('{q}', o.q)
    if (s === suggestionPlaceType.enum.tomtom) u = constants.SEARCH_API_URL_TOMTOM.replace('{q}', o.q)
    if (u === '') throw new Error('unkown search api url')

    const url = new URL(u)

    if (o) for (const k in o) url.searchParams.append(k, o[k])

    const res = await fetch(url.toString(), { method: 'GET' })
    const d = await res.json()

    let r: SuggestionPlaces = []

    if (s === suggestionPlaceType.enum.openstreetmap) {
      r = d?.map(
        ({ display_name, boundingbox, lat, lon, osm_id }) =>
          ({
            boundingbox: boundingbox?.map(v => String(v)),
            name: display_name,
            lat: String(lat),
            lon: String(lon),
            id: String(osm_id),
            type: 'openstreetmap',
          }) as SuggestionPlaces[number],
      )
    }

    if (s === suggestionPlaceType.enum.tomtom) {
      r = d?.results?.map(
        ({ address, position, id, viewport }) =>
          ({
            boundingbox: [
              String(viewport.btmRightPoint.lat),
              String(viewport.topLeftPoint.lat),
              String(viewport.btmRightPoint.lon),
              String(viewport.topLeftPoint.lat),
            ],
            name: address?.freeformAddress,
            lat: String(position?.lat),
            lon: String(position.lon),
            id: String(id),
            type: 'tomtom',
          }) as SuggestionPlaces[number],
      )
    }

    suggestionPlaces.parse(r)

    return r
  } catch (e) {
    console.error(e)
  }
}

export type Search = typeof search
