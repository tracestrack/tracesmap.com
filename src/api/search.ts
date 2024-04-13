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

const suggestionType = z.enum(['openstreetmap', 'tomtom'])
type SuggestionType = z.infer<typeof suggestionType>

const suggestion = z.object({
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
  boundingbox: z.array(z.number()).optional(),
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  type: suggestionType,
})

export type Suggestion = z.infer<typeof suggestion>

const suggestions = z.array(suggestion)

export type Suggestions = z.infer<typeof suggestions>

export async function search(o: SearchParams, s: SearchServiceKey = 'openstreetmap'): Promise<Suggestions> {
  try {
    let u = ''
    if (s === suggestionType.enum.openstreetmap) u = constants.SEARCH_API_URL_OPENSTREETMAP.replace('{q}', o.q)
    if (s === suggestionType.enum.tomtom) u = constants.SEARCH_API_URL_TOMTOM.replace('{q}', o.q)
    if (u === '') throw new Error('unkown search api url')

    const url = new URL(u)

    if (o) for (const k in o) url.searchParams.append(k, o[k])

    const res = await fetch(url.toString(), { method: 'GET' })
    const d = await res.json()

    let r: Suggestions = []

    if (s === suggestionType.enum.openstreetmap) {
      r = d?.map(
        ({ display_name, boundingbox, lat, lon, osm_id }) =>
          ({
            boundingbox: boundingbox?.map(v => parseFloat(v)),
            name: display_name,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            id: String(osm_id),
            type: 'openstreetmap',
          }) as Suggestions[number],
      )
      console.log(r)
    }

    if (s === suggestionType.enum.tomtom) {
      r = d?.results?.map(
        ({ address, position, id, viewport }) =>
          ({
            boundingbox: [
              viewport.btmRightPoint.lat,
              viewport.topLeftPoint.lat,
              viewport.btmRightPoint.lon,
              viewport.topLeftPoint.lon,
            ],
            name: address?.freeformAddress,
            lat: position.lat,
            lon: position.lon,
            id: String(id),
            type: 'tomtom',
          }) as Suggestions[number],
      )
      console.log(r)
    }

    suggestions.parse(r)

    return r
  } catch (e) {
    console.error(e)
  }
}

export type Search = typeof search
