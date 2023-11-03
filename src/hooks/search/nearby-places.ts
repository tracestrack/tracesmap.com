import type { Coordinate } from 'ol/coordinate'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { api } from '../../api'
import { state } from '../../state'
import type { Place } from '../../state/map'

export function useNearbyPlaces() {
  const [selectedNearbyPlace, setSelectedNearbyPlace] = useRecoilState(state.map.selectedNearbyPlace)
  const [nearbyPlaces, setNearbyPlaces] = useRecoilState(state.map.nearbyPlaces)
  const resetSelectedNearbyPlace = useResetRecoilState(state.map.selectedNearbyPlace)
  const resetNearbyPlaces = useResetRecoilState(state.map.nearbyPlaces)

  const searchNearbyPlaces = async (coordinate: Coordinate) => {
    try {
      const res = await api.nearbyPlaces({ coordinate })
      setNearbyPlaces(res.filter(v => v.name))
      return res
    } catch (e) {
      console.error(e)
    }
  }

  const selectNearbyPlace = (id: Place['id']) => setSelectedNearbyPlace(nearbyPlaces.find(v => v.id == id))

  const reset = () => {
    resetNearbyPlaces()
    resetSelectedNearbyPlace()
  }

  return { nearbyPlaces, searchNearbyPlaces, selectedNearbyPlace, selectNearbyPlace, reset }
}
