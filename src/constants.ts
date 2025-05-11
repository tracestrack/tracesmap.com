export const BASE_SOURCE_URL =
  import.meta.env.VITE_BASE_SOURCE_URL ||
  'https://tile.tracestrack.com/base/{z}/{x}/{y}.png?key=710cc921fda7d757cc9b0aecd40ad3be'
export const STREET_SOURCE_URL =
  import.meta.env.VITE_STREET_SOURCE_URL ||
  'https://tile.tracestrack.com/base/{z}/{x}/{y}.png?key=710cc921fda7d757cc9b0aecd40ad3be'
export const SATELLITE_SOURCE_URL =
  import.meta.env.VITE_SATELLITE_SOURCE_URL ||
  'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1Ijoic3Ryb25nd2lsbG93IiwiYSI6ImxKa2R1SEkifQ.iZ_vj1lvuvrAcUIl0ZE5XA'
export const TOPO_SOURCE_URL =
  import.meta.env.VITE_TOPO_SOURCE_URL ||
  'https://tile.tracestrack.com/topo/{z}/{x}/{y}.png?key=710cc921fda7d757cc9b0aecd40ad3be'
export const ORM_INFRA_SOURCE_URL =
  import.meta.env.VITE_ORM_INFRA_SOURCE_URL || 'https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png'
export const ORM_SPEED_SOURCE_URL =
  import.meta.env.VITE_ORM_SPEED_SOURCE_URL || 'https://tiles.openrailwaymap.org/maxspeed/{z}/{x}/{y}.png'
export const TRAFFIC_SOURCE_URL =
  import.meta.env.VITE_TRAFFIC_SOURCE_URL ||
  'https://api.tomtom.com/traffic/map/4/tile/flow/relative-delay/{z}/{x}/{y}.png?key=O5LGYfXUsThtDAoj8FsQKJlf5oll98tq&thickness=10&tileSize=512'
export const GPS_SOURCE_URL =
  import.meta.env.VITE_GPS_SOURCE_URL || 'https://gps.tile.openstreetmap.org/lines/{z}/{x}/{y}.png'
export const LANGUAGE_SOURCE_URL =
  import.meta.env.VITE_LANGUAGE_SOURCE_URL ||
  'https://tile.tracestrack.com/{language}/{z}/{x}/{y}.png?key=710cc921fda7d757cc9b0aecd40ad3be&style'

export const SEARCH_API_URL_OPENSTREETMAP =
  import.meta.env.VITE_SEARCH_API_URL_OPENSTREETMAP || 'https://nominatim.openstreetmap.org/search?q={q}&format=json'
export const SEARCH_API_URL_TOMTOM =
  import.meta.env.VITE_SEARCH_API_URL_TOMTOM ||
  'https://api.tomtom.com/search/2/search/{q}.json?&view=Unified&key=QVirBXWZ9x7Yu9q4SahKl0hWlvppV8ul'
export const ROUTE_API_URL = `https://api.openrouteservice.org/v2/directions/{transportMethod}?api_key=5b3ce3597851110001cf62488c0ecc42793146ce96a0f582119e0812&start={start}&end={end}`
export const PLACE_API_URL = 'https://lz4.overpass-api.de/api/interpreter'
export const POI_API_URL = ''

export const constants = {
  ORM_INFRA_SOURCE_URL,
  ORM_SPEED_SOURCE_URL,
  TRAFFIC_SOURCE_URL,
  GPS_SOURCE_URL,
  BASE_SOURCE_URL,
  STREET_SOURCE_URL,
  SATELLITE_SOURCE_URL,
  TOPO_SOURCE_URL,
  LANGUAGE_SOURCE_URL,

  SEARCH_API_URL_OPENSTREETMAP,
  SEARCH_API_URL_TOMTOM,
  ROUTE_API_URL,
  PLACE_API_URL,
  POI_API_URL,
}
