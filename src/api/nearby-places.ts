import type { Coordinate } from 'ol/coordinate'
import { constants } from '../constants'
import type { Place } from '../state/map'

export interface NearbyPlacesParams {
  coordinate: Coordinate
}

export type NearbyPlacesReturn = Place[]

export async function nearbyPlaces(p: NearbyPlacesParams): Promise<NearbyPlacesReturn> {
  try {
    const body = `data=${encodeURIComponent(
      `[out:json][timeout:25];(node["place"](around: 1000, ${p.coordinate[1]}, ${p.coordinate[0]}););out 10;`,
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
        tags: {
          name: string
          place: string
        }
      }[]
    } = await res.json()

    let a = o?.elements?.map(v => ({ id: v.id, name: v.tags.name, coordinate: [v.lon, v.lat] })) || []

    return a
  } catch (e) {
    console.error(e)
  }
}
