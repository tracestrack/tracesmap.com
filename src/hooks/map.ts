import lodash from 'lodash'
import { Feature, Map, View } from 'ol'
import { Attribution, Zoom } from 'ol/control'
import { Coordinate } from 'ol/coordinate'
import { pointerMove } from 'ol/events/condition'
import { boundingExtent } from 'ol/extent'
import { LineString, Point } from 'ol/geom'
import { Select } from 'ol/interaction'
import { Tile as TileLayer, Vector as VectorLayer, WebGLTile as WebGLTileLayer } from 'ol/layer'
import { fromLonLat, get, transform, transformExtent } from 'ol/proj'
import { Vector as VectorSource, XYZ as XYZSource } from 'ol/source'
import { Circle, Fill, Stroke, Style } from 'ol/style'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { constants } from '../constants'
import { state } from '../state'
import { utils } from '../utils'
import type { MapBaseLayer, MapLanguage, MapOverlayLayer, MapStyle } from '../variables'
import { variables } from '../variables'
import { useSuggestPlace } from './search/suggest-place'

interface useSettingsValue {
  baseLayer?: MapBaseLayer
  overlayLayer?: MapOverlayLayer
  style?: MapStyle
  language?: MapLanguage
}

type useSettingsSetValue = (o: useSettingsValue) => void

export function useSettings(): [useSettingsValue, useSettingsSetValue] {
  const [baseLayer, setBaseLayer] = useRecoilState(state.map.baseLayer)
  const [overlayLayer, setOverlayLayer] = useRecoilState(state.map.overlayLayer)
  const [style, setStyle] = useRecoilState(state.map.style)
  const [language, setLanguage] = useRecoilState(state.map.language)

  const settings: useSettingsValue = {
    baseLayer,
    overlayLayer,
    style,
    language,
  }

  const setSettings: useSettingsSetValue = o => {
    if (o.baseLayer) setBaseLayer(o.baseLayer)
    if (o.overlayLayer) setOverlayLayer(o.overlayLayer)
    if (o.style) setStyle(o.style)
    if (o.language) setLanguage(o.language)
  }

  return [settings, setSettings]
}

export function useGetCurrentPosition() {
  const [currentPosition, setCurrentPosition] = useRecoilState(state.map.currentPosition)

  const getCurrentPosition = fn => {
    let p

    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      p = [latitude, longitude]
      setCurrentPosition(p)
      fn(p)
    })

    return p
  }

  return [currentPosition, getCurrentPosition]
}

export function usePickPosition() {
  const [mapRef] = useRecoilState(state.map.ref)
  const [position, setPosition] = useState<number[]>()

  const pickPosition = (p: typeof position) => {
    if (!mapRef) return
    setPosition(p)
  }

  return [position, pickPosition]
}

interface UseMapArg {
  target?: string
}

export function useMap(arg?: UseMapArg) {
  const [mapRef, setMapRef] = useRecoilState(state.map.ref)
  let centerLonLat = useRecoilValue(state.map.center)
  const center = transform([centerLonLat[1], centerLonLat[0]], 'EPSG:4326', 'EPSG:3857')
  const zoom = useRecoilValue(state.map.zoom)

  useEffect(() => {
    if (mapRef) return
    if (!arg?.target) return

    const view = new View({
      center,
      zoom,
      maxZoom: 19,
      constrainResolution: true,
    })

    const map = new Map({
      target: arg.target,
      maxTilesLoading: 40,
      view,
      controls: [new Attribution({ collapsible: true })],
    })

    setMapRef(map)
  }, [])

  return mapRef
}

export function useBaseLayer() {
  const [mapRef] = useRecoilState(state.map.ref)
  const [mapSettings] = useSettings()
  const [baseLayer, setBaseLayer] = useRecoilState(state.map.layerRef(variables.baseLayerID))
  const [overlayLayer] = useRecoilState(state.map.layerRef(variables.overlayLayerID))
  const [languageLayer] = useRecoilState(state.map.layerRef(variables.languageLayerID))
  const [positionPointLayer] = useRecoilState(state.map.layerRef(variables.positionPointLayerID))
  const [directionLayer] = useRecoilState(state.map.layerRef(variables.directionLayerID))
  const [nearbyPlacesLayer] = useRecoilState(state.map.layerRef(variables.nearbyPlacesLayerID))
  const [poiPlacesLayer] = useRecoilState(state.map.layerRef(variables.poiPlacesLayerID))
  const [suggestionPlacesLayer] = useRecoilState(state.map.layerRef(variables.suggestionPlacesLayerID))

  useEffect(() => {
    if (!mapRef) return
    if (!mapSettings.baseLayer) return

    const baseLayerStyleName = mapSettings.baseLayer === 'satellite' ? 'normal' : mapSettings.style

    const baseLayerSourceUrl =
      utils.map.getBaseLayerSourceUrl(mapSettings.baseLayer) + (baseLayerStyleName === 'dark' ? '&style=dark3' : '')

    const baseLayerSourceOptions = {
      opaque: true,
      cacheSize: 200,
      transition: 400,
      urls: [baseLayerSourceUrl],
      crossOrigin: null,
      tilePixelRatio: 2,
    }
    const baseLayerSource = new XYZSource(baseLayerSourceOptions)

    const newBaseLayer = new WebGLTileLayer({
      preload: Infinity,
      source: baseLayerSource,
    })

    if (baseLayer) mapRef.removeLayer(baseLayer)
    if (mapSettings.baseLayer === 'satellite' || mapSettings.baseLayer === 'transport') {
      mapRef.addLayer(newBaseLayer)
    }

    // reset layers
    // 0. base layer
    // 1. overlay layer
    // 2. language layer
    // 3. click point layer
    // 4. direction layer
    // 5. search layer
    // 6. nearby places layer
    // 7. poi places layer
    // 8. suggestion places layer
    if (overlayLayer) {
      mapRef.removeLayer(overlayLayer)
      mapRef.addLayer(overlayLayer)
    }

    if (languageLayer) {
      mapRef.removeLayer(languageLayer)
      mapRef.addLayer(languageLayer)
    }

    if (positionPointLayer) {
      mapRef.removeLayer(positionPointLayer)
      mapRef.addLayer(positionPointLayer)
    }

    if (directionLayer) {
      mapRef.removeLayer(directionLayer)
      mapRef.addLayer(directionLayer)
    }

    if (nearbyPlacesLayer) {
      mapRef.removeLayer(nearbyPlacesLayer)
      mapRef.addLayer(nearbyPlacesLayer)
    }

    if (poiPlacesLayer) {
      mapRef.removeLayer(poiPlacesLayer)
      mapRef.addLayer(poiPlacesLayer)
    }

    if (suggestionPlacesLayer) {
      mapRef.removeLayer(suggestionPlacesLayer)
      mapRef.addLayer(suggestionPlacesLayer)
    }

    setBaseLayer(newBaseLayer)
  }, [mapSettings.baseLayer, mapSettings.style, mapRef])

  return baseLayer
}

export function useLanguageLayer() {
  const [mapRef] = useRecoilState(state.map.ref)
  const [mapSettings] = useSettings()
  const [languageLayer, setLanguageLayer] = useRecoilState(state.map.layerRef(variables.languageLayerID))

  useEffect(() => {
    if (!mapRef) return
    if (mapSettings.overlayLayer === 'orm-infra') return

    const baseLayerStyleName = mapSettings.baseLayer === 'satellite' ? 'normal' : mapSettings.style

    var mapLanguageLayerSourceUrl = utils.map.getLanguageLayerSourceUrl(mapSettings.language, baseLayerStyleName)
    if (mapSettings.baseLayer === 'street') {
      mapLanguageLayerSourceUrl = mapLanguageLayerSourceUrl.replace('-name', '')
    } else if (mapSettings.baseLayer === 'topo') {
      mapLanguageLayerSourceUrl = mapLanguageLayerSourceUrl.replace('-name', '').replace('.com/', '.com/topo_')
    } else if (mapSettings.baseLayer === 'transport') {
      mapLanguageLayerSourceUrl = ''
    }

    const langLayerSourceOptions = {
      opaque: true,
      cacheSize: 200,
      transition: 400,
      urls: [mapLanguageLayerSourceUrl],
      crossOrigin: null,
      tilePixelRatio: 2,
    }

    const langLayerSource = new XYZSource(langLayerSourceOptions)
    const langLayerStyle = utils.map.getStyle(baseLayerStyleName, 'base')
    const newLanguageLayer = new WebGLTileLayer({
      preload: Infinity,
      style: baseLayerStyleName === 'dark' ? null : langLayerStyle,
      source: langLayerSource,
    })

    mapRef.removeLayer(languageLayer)
    if (mapLanguageLayerSourceUrl !== '') {
      mapRef.addLayer(newLanguageLayer)
    }

    setLanguageLayer(newLanguageLayer)
  }, [mapSettings.baseLayer, mapSettings.language, mapSettings.style, mapRef])

  return languageLayer
}

export function useOverlayLayer() {
  const [mapRef] = useRecoilState(state.map.ref)
  const [mapSettings] = useSettings()
  const [overlayLayer, setOverlayLayer] = useRecoilState(state.map.layerRef(variables.overlayLayerID))

  useEffect(() => {
    if (!mapRef) return
    if (!mapSettings.overlayLayer) return

    const overlayLayerSourceUrl = utils.map.getOverlayLayerSourceUrl(mapSettings.overlayLayer)

    const overlayLayerSource = new XYZSource({
      opaque: false,
      cacheSize: 200,
      transition: 100,
      urls: [overlayLayerSourceUrl],
      crossOrigin: null,
      tilePixelRatio: 2,
    })

    const newOverlayLayer = new TileLayer({
      preload: Infinity,
      source: overlayLayerSource,
    })

    mapRef.removeLayer(overlayLayer)
    mapRef.addLayer(newOverlayLayer)

    setOverlayLayer(newOverlayLayer)
  }, [mapSettings.overlayLayer, mapRef])

  return overlayLayer
}

export function usePositionPointLayer() {
  const [mapRef] = useRecoilState(state.map.ref)
  const [positionPointLayer, setPositionPointLayer] = useRecoilState(state.map.layerRef(variables.positionPointLayerID))

  useEffect(() => {
    if (!mapRef) return
    if (positionPointLayer) return

    const newPositionPointLayer = new VectorLayer({
      source: new VectorSource(),
    })

    mapRef.addLayer(newPositionPointLayer)

    setPositionPointLayer(newPositionPointLayer)
  }, [mapRef, positionPointLayer])

  return positionPointLayer
}

export function useMapEvents() {
  const [_, addPinPosition] = usePinPosition()
  const contextMenu = useContextMenu()

  const [mapRef] = useRecoilState(state.map.ref)
  const setCenter = useSetRecoilState(state.map.center)
  const setZoom = useSetRecoilState(state.map.zoom)

  const viewOnChangeCenter = lodash.debounce(e => {
    const v = e.target.getCenter()
    let c = transform(v, 'EPSG:3857', 'EPSG:4326')
    setCenter([Number(c[1].toFixed(4)), Number(c[0].toFixed(4))])
  }, 600)

  const viewOnChangeResolutions = lodash.debounce(e => {
    const v = e.target.getZoom()
    setZoom(v)
  }, 600)

  const mapOnClick = useCallback(
    e => {
      const c = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
      addPinPosition(c)
    },
    [addPinPosition],
  )

  const onContextMenu = useCallback(
    e => {
      e.preventDefault()

      if (!mapRef) return

      const coord = mapRef.getEventCoordinate(e)
      const c = transform(coord, 'EPSG:3857', 'EPSG:4326')

      addPinPosition(c)

      contextMenu.setOpen(true)
      contextMenu.setPosition({ x: e.x, y: e.y })
    },
    [addPinPosition, mapRef],
  )

  mapRef?.getView().un('change:center', viewOnChangeCenter)
  mapRef?.getView().on('change:center', viewOnChangeCenter)

  mapRef?.getView().on('change:resolution', viewOnChangeResolutions)

  mapRef?.un('click', mapOnClick)
  mapRef?.on('click', mapOnClick)

  mapRef?.getViewport().removeEventListener('contextmenu', onContextMenu)
  mapRef?.getViewport().addEventListener('contextmenu', onContextMenu)
}

export function useDirectionInteraction() {
  const [mapRef] = useRecoilState(state.map.ref)
  const field = useRef<'from' | 'to'>()

  const { start, setStart, end, setEnd } = useDirection()
  const directionLayer = useDirectionLayer()
  const addDirectionPoints = useAddDirectionPoints()
  const addDirectionRoute = useAddDirectionRoute()

  const mapOnClick = useCallback(e => {
    const c = transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
    if (field.current === 'from') setStart(c)
    if (field.current === 'to') setEnd(c)
  }, [])

  useEffect(() => {
    addDirectionPoints([start, end])
    if (start && end) addDirectionRoute(start, end)
    mapRef?.un('click', mapOnClick)
  }, [start, end, directionLayer])

  const directionInteraction = (s: (typeof field)['current']) => {
    field.current = s
    mapRef?.un('click', mapOnClick)
    mapRef?.on('click', mapOnClick)
  }

  return directionInteraction
}

export function useDirectionLayer() {
  const [mapRef] = useRecoilState(state.map.ref)
  const [directionLayer, setDirectionLayer] = useRecoilState(state.map.layerRef(variables.directionLayerID))

  useEffect(() => {
    if (!mapRef) return
    if (directionLayer) return

    const newDirectionLayer = new VectorLayer({
      source: new VectorSource(),
    })

    mapRef.addLayer(newDirectionLayer)

    setDirectionLayer(newDirectionLayer)
  }, [mapRef, directionLayer])

  return directionLayer
}

export function useAddDirectionRoute() {
  const { direction, start, end, setDuration, setDistance } = useDirection()

  const directionLayer = useRecoilValue<VectorLayer<VectorSource>>(state.map.layerRef(variables.directionLayerID))

  const addDirectionRoute = useCallback(
    async (start: Coordinate, end: Coordinate) => {
      if (!directionLayer) return

      const source = directionLayer.getSource()
      source.forEachFeature(v => v.getGeometry()?.constructor === LineString && source.removeFeature(v))

      if (!directionLayer || !direction || !start || !end) return

      try {
        const url = constants.ROUTE_API_URL.replace('{transportMethod}', direction)
          .replace('{start}', `${start[0]},${start[1]}`)
          .replace('{end}', `${end[0]},${end[1]}`)
        const res = await fetch(url)
        const json = await res.json()

        const summary = json.features[0].properties.summary
        const distance = parseInt(summary.distance) / 1000
        const duration = parseInt(summary.duration) / 60

        setDistance(Number(distance.toFixed(variables.distanceFixed)))
        setDuration(Number(duration.toFixed(variables.durationFixed)))

        const feature = new Feature()

        feature.setStyle(
          new Style({
            stroke: new Stroke({
              width: 5,
              color: '#bc70ff',
            }),
          }),
        )

        const polyline = new LineString(json.features[0].geometry.coordinates)
        polyline.transform('EPSG:4326', 'EPSG:3857')

        feature.setGeometry(polyline)

        if (feature) source.addFeature(feature)
      } catch (e) {
        console.error(e)
      }
    },
    [directionLayer, start, end, direction],
  )

  return addDirectionRoute
}

export function useAddDirectionPoints() {
  const routeLayer = useRecoilValue<VectorLayer<VectorSource>>(state.map.layerRef(variables.directionLayerID))

  const addDirectionPoints = useCallback(
    (points: Coordinate[]) => {
      const style = new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({
            color: '#bc70ff',
          }),
        }),
      })

      const features = points
        .filter(v => v)
        .map(point => {
          const feature = new Feature()
          feature.setStyle(style)
          feature.setGeometry(new Point(fromLonLat(point)))
          return feature
        })

      if (routeLayer) {
        const source = routeLayer.getSource()
        source.forEachFeature(v => v.getGeometry()?.constructor === Point && source.removeFeature(v))
        source.addFeatures(features)
      }
    },
    [routeLayer],
  )

  return addDirectionPoints
}

export function useContextMenu() {
  const [s, us] = useRecoilState(state.map.contextMenu)
  const { open, position } = s
  const setOpen = (v: typeof s.open) => us(o => ({ ...o, open: v }))
  const setPosition = (v: typeof s.position) => us(o => ({ ...o, position: v }))
  return { open, setOpen, setPosition, position }
}

export function usePinPosition(): [Coordinate, (c: Coordinate) => void] {
  const pinPositionLayer = useRecoilValue<VectorLayer<VectorSource>>(state.map.layerRef(variables.positionPointLayerID))

  const [pinPosition, setPinPosition] = useRecoilState(state.map.pinPosition)

  const addPinPosition = useCallback(
    (c: Coordinate) => {
      const feature = new Feature()

      feature.setStyle(
        new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({
              color: '#ffe091',
            }),
            stroke: new Stroke({
              color: '#b0b0b0',
              width: 2,
            }),
          }),
        }),
      )

      feature.setGeometry(new Point(fromLonLat(c)))

      setPinPosition(c)

      if (pinPositionLayer) {
        const source = pinPositionLayer.getSource()
        source.forEachFeature(v => source.removeFeature(v))
        source.addFeature(feature)
      }
    },
    [pinPositionLayer],
  )

  return [pinPosition, addPinPosition]
}

export function useDirection() {
  const [direction, setDirection] = useRecoilState(state.map.direction)
  const [start, setStart] = useRecoilState(state.map.start)
  const [end, setEnd] = useRecoilState(state.map.end)
  const [distance, setDistance] = useRecoilState(state.map.distance)
  const [duration, setDuration] = useRecoilState(state.map.duration)

  return { direction, start, end, setDirection, setStart, setEnd, distance, duration, setDistance, setDuration }
}

export function useControl() {
  const map = useRecoilValue(state.map.ref)

  const zoomIn = () => {
    if (!map) return

    const view = map.getView()
    const maxZoom = view.getMaxZoom()
    const prevZoom = view.getZoom()
    const nextZoom = lodash.min([prevZoom + 1, maxZoom])
    view.setZoom(nextZoom)
  }

  const zoomOut = () => {
    if (!map) return

    const view = map.getView()
    const minZoom = view.getMinZoom()
    const prevZoom = view.getZoom()
    const nextZoom = lodash.max([prevZoom - 1, minZoom])
    view.setZoom(nextZoom)
  }

  const moveCenter = (lat, lon) => {
    if (!map) return

    const view = map.getView()
    const c = fromLonLat([Number(lon), Number(lat)])
    view.setZoom(11)
    view.setCenter(c)
  }

  return { zoomIn, zoomOut, moveCenter }
}

export function useSearchLayer() {
  const mapRef = useRecoilValue(state.map.ref)
  const [searchLayer, setSearchLayer] = useRecoilState(state.map.layerRef(variables.searchLayerID))

  useEffect(() => {
    if (!mapRef) return
    if (searchLayer) return

    const newSearchLayer = new VectorLayer({
      source: new VectorSource(),
    })

    mapRef.addLayer(newSearchLayer)

    setSearchLayer(newSearchLayer)
  }, [mapRef, searchLayer])
}

export function useNearbyPlacesLayer() {
  const [mapRef] = useRecoilState(state.map.ref)
  const [mapSettings] = useSettings()
  const [layer, setLayer] = useRecoilState(state.map.layerRef(variables.nearbyPlacesLayerID))
  const nearbyPlaces = useRecoilValue(state.map.nearbyPlaces)
  const [selectedNearbyPlace, setSelectedNearbyPlace] = useRecoilState(state.map.selectedNearbyPlace)

  const style = useMemo(
    () =>
      new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: '#219ebc' }),
          stroke: new Stroke({
            color: 'white',
            width: 2,
          }),
        }),
      }),
    [],
  )

  const hoverStyle = useMemo(
    () =>
      new Style({
        image: new Circle({
          radius: 9,
          fill: new Fill({ color: '#219ebc' }),
          stroke: new Stroke({
            color: 'white',
            width: 2,
          }),
        }),
      }),
    [],
  )

  const nearbyPlaceMarkerHoverInteraction = useMemo(
    () =>
      new Select({
        condition: pointerMove,
        style: hoverStyle,
      }),
    [],
  )

  const nearbyPlaceMarkerInteractionFn = useCallback(
    e => {
      const id = e?.selected?.[0]?.getProperties()?.id
      if (id == selectedNearbyPlace?.id) return

      const o = nearbyPlaces?.find(v => v.id == id)
      if (o) setSelectedNearbyPlace(o)
    },
    [nearbyPlaces, selectedNearbyPlace],
  )

  nearbyPlaceMarkerHoverInteraction.un('select', nearbyPlaceMarkerInteractionFn)
  nearbyPlaceMarkerHoverInteraction.on('select', nearbyPlaceMarkerInteractionFn)

  useEffect(() => {
    if (!mapRef) return
    if (layer) return

    const source = new VectorSource({
      features: [],
    })

    const newLayer = new VectorLayer({
      source,
    })

    mapRef.addLayer(newLayer)
    setLayer(newLayer)

    mapRef.removeInteraction(nearbyPlaceMarkerHoverInteraction)
    mapRef.addInteraction(nearbyPlaceMarkerHoverInteraction)
  }, [mapRef, mapSettings, layer])

  useEffect(() => {
    if (!layer) return

    const source = layer.getSource()

    source.forEachFeature(v => source.removeFeature(v))

    const features = nearbyPlaces.map(v => {
      const f = new Feature({
        id: v.id,
        geometry: new Point(fromLonLat(v.coordinate)),
      })

      if (selectedNearbyPlace?.id == v.id) f.setStyle(hoverStyle)
      else f.setStyle(style)

      return f
    })

    source.addFeatures(features)
  }, [layer, nearbyPlaces, selectedNearbyPlace])

  return layer
}

export function usePOIPlacesLayer() {
  const [mapRef] = useRecoilState(state.map.ref)
  const [mapSettings] = useSettings()
  const [layer, setLayer] = useRecoilState(state.map.layerRef(variables.poiPlacesLayerID))
  const poiPlaces = useRecoilValue(state.map.poiPlaces)
  const [selectedPOIPlace, setSelectedPOIPlace] = useRecoilState(state.map.selectedPOIPlace)

  const style = useMemo(
    () =>
      new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: '#219ebc' }),
          stroke: new Stroke({
            color: 'white',
            width: 2,
          }),
        }),
      }),
    [],
  )

  const hoverStyle = useMemo(
    () =>
      new Style({
        image: new Circle({
          radius: 9,
          fill: new Fill({ color: '#219ebc' }),
          stroke: new Stroke({
            color: 'white',
            width: 2,
          }),
        }),
      }),
    [],
  )

  const poiPlaceMarkerHoverInteraction = useMemo(
    () =>
      new Select({
        condition: pointerMove,
        style: hoverStyle,
      }),
    [],
  )

  const poiPlaceMarkerInteractionFn = useCallback(
    e => {
      const id = e?.selected?.[0]?.getProperties()?.id
      if (id == selectedPOIPlace?.id) return

      const o = poiPlaces?.find(v => v.id == id)
      if (o) setSelectedPOIPlace(o)
    },
    [poiPlaces, selectedPOIPlace],
  )

  poiPlaceMarkerHoverInteraction.un('select', poiPlaceMarkerInteractionFn)
  poiPlaceMarkerHoverInteraction.on('select', poiPlaceMarkerInteractionFn)

  useEffect(() => {
    if (!mapRef) return
    if (layer) return

    const source = new VectorSource({
      features: [],
    })

    const newLayer = new VectorLayer({
      source,
    })

    mapRef.addLayer(newLayer)
    setLayer(newLayer)

    mapRef.removeInteraction(poiPlaceMarkerHoverInteraction)
    mapRef.addInteraction(poiPlaceMarkerHoverInteraction)
  }, [mapRef, mapSettings, layer])

  useEffect(() => {
    if (!layer) return

    const source = layer.getSource()

    source.forEachFeature(v => source.removeFeature(v))

    const features = poiPlaces.map(v => {
      const f = new Feature({
        id: v.id,
        geometry: new Point(fromLonLat(v.coordinate)),
      })

      if (selectedPOIPlace?.id == v.id) f.setStyle(hoverStyle)
      else f.setStyle(style)

      return f
    })

    source.addFeatures(features)
  }, [layer, poiPlaces, selectedPOIPlace])

  return layer
}

export function useSuggestionPlacesLayer() {
  const [mapRef] = useRecoilState(state.map.ref)
  const [mapSettings] = useSettings()
  const [layer, setLayer] = useRecoilState(state.map.layerRef(variables.suggestionPlacesLayerID))
  const suggestionPlaces = useRecoilValue(state.map.suggestionPlaces)
  const [selectedSuggestionPlace, setSelectedSuggestionPlace] = useRecoilState(state.map.selectedSuggestionPlace)

  const style = useMemo(
    () =>
      new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: '#219ebc' }),
          stroke: new Stroke({
            color: 'white',
            width: 2,
          }),
        }),
      }),
    [],
  )

  const hoverStyle = useMemo(
    () =>
      new Style({
        image: new Circle({
          radius: 9,
          fill: new Fill({ color: '#219ebc' }),
          stroke: new Stroke({
            color: 'white',
            width: 2,
          }),
        }),
      }),
    [],
  )

  const suggestionPlaceMarkerHoverInteraction = useMemo(
    () =>
      new Select({
        condition: pointerMove,
        style: hoverStyle,
      }),
    [],
  )

  const suggestionPlaceMarkerInteractionFn = useCallback(
    e => {
      const id = e?.selected?.[0]?.getProperties()?.id
      if (id == selectedSuggestionPlace?.id) return

      const o = suggestionPlaces?.find(v => v.id == id)
      if (o) setSelectedSuggestionPlace(o)
    },
    [suggestionPlaces, selectedSuggestionPlace],
  )

  suggestionPlaceMarkerHoverInteraction.un('select', suggestionPlaceMarkerInteractionFn)
  suggestionPlaceMarkerHoverInteraction.on('select', suggestionPlaceMarkerInteractionFn)

  useEffect(() => {
    if (!mapRef) return
    if (layer) return

    const source = new VectorSource({
      features: [],
    })

    const newLayer = new VectorLayer({
      source,
    })

    mapRef.addLayer(newLayer)
    setLayer(newLayer)

    mapRef.removeInteraction(suggestionPlaceMarkerHoverInteraction)
    mapRef.addInteraction(suggestionPlaceMarkerHoverInteraction)
  }, [mapRef, mapSettings, layer])

  useEffect(() => {
    if (!layer) return

    const source = layer.getSource()

    source.forEachFeature(v => source.removeFeature(v))

    const features = suggestionPlaces.map(v => {
      const f = new Feature({
        id: v.id,
        geometry: new Point(fromLonLat(v.coordinate)),
      })

      if (selectedSuggestionPlace?.id == v.id) f.setStyle(hoverStyle)
      else f.setStyle(style)

      return f
    })

    source.addFeatures(features)
  }, [layer, suggestionPlaces, selectedSuggestionPlace])

  return layer
}

export const useFitViewToSuggestionPlaces = () => {
  const map = useMap()
  const { moveCenter } = useControl()
  const { suggestionPlaces } = useSuggestPlace()

  useEffect(() => {
    if (!map) return
    if (suggestionPlaces?.length === 0) return

    const coordinates = suggestionPlaces.map(v => v.coordinate)

    if (coordinates.length > 1) {
      let be = boundingExtent(coordinates)
      be = transformExtent(be, get('EPSG:4326'), get('EPSG:3857'))
      const view = map.getView()
      view.fit(be)
    }

    if (coordinates.length === 1) {
      moveCenter(coordinates[0][1], coordinates[0][0])
    }
  }, [map, suggestionPlaces])
}

export const map = {
  useSettings,

  useMap,

  useBaseLayer,
  useOverlayLayer,
  useLanguageLayer,
  usePositionPointLayer,
  useDirectionLayer,

  useNearbyPlacesLayer,
  usePOIPlacesLayer,
  useSuggestionPlacesLayer,

  useSearchLayer,

  useFitViewToSuggestionPlaces,

  useMapEvents,

  useDirection,

  useControl,

  useGetCurrentPosition,
  useDirectionInteraction,
  usePinPosition,
  useAddDirectionRoute,

  useContextMenu,
}
