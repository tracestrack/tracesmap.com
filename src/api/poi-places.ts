import type { Coordinate } from 'ol/coordinate'
import { constants } from '../constants'
import type { Place } from '../state/map'

export interface POIPlacesParams {
  coordinate: Coordinate
}

export type POIPlacesReturn = Place[]

export async function poiPlaces(p: POIPlacesParams): Promise<POIPlacesReturn> {
  try {
    const c = `${p.coordinate[1]}, ${p.coordinate[0]}`
    const body = `data=${encodeURIComponent(
      `[out:json][timeout:25];(nwr["amenity"](around: 100, ${c});nwr["shop"](around: 100, ${c});nwr["office"](around: 100, ${c});nwr["leisure"](around: 100, ${c});nwr["tourism"](around: 100, ${c}););out ids tags center;`,
    )}`

    const res = await fetch(constants.PLACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })

    const o: {
      elements: {
        type: 'node'
        id: number
        lat: number
        lon: number
        center: {
          lat: number
          lon: number
        }
        tags: {
          name: string
          place: string
        }
      }[]
    } = await res.json()

    let a =
      o?.elements?.map(v => ({
        id: v.id,
        name: v.tags.name,
        coordinate: [v.lon || v.center?.lon, v.lat || v.center?.lat],
      })) || []

    return a
  } catch (e) {
    console.error(e)
  }
}
