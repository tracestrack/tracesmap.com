import type { Coordinate } from 'ol/coordinate'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { api } from '../../api'
import { state } from '../../state'
import type { Place } from '../../state/map'

export function usePOIPlaces() {
  const [selectedPOIPlace, setSelectedPOIPlace] = useRecoilState(state.map.selectedPOIPlace)
  const [poiPlaces, setPOIPlaces] = useRecoilState(state.map.poiPlaces)
  const resetSelectedPOIPlace = useResetRecoilState(state.map.selectedPOIPlace)
  const resetPOIPlaces = useResetRecoilState(state.map.poiPlaces)

  const searchPOIPlaces = async (coordinate: Coordinate) => {
    try {
      const res = await api.poiPlaces({ coordinate })
      setPOIPlaces(res.filter(v => v.name))
      return res
    } catch (e) {
      console.error(e)
    }
  }

  const selectPOIPlace = (id: Place['id']) => setSelectedPOIPlace(poiPlaces.find(v => v.id == id))

  const reset = () => {
    resetPOIPlaces()
    resetSelectedPOIPlace()
  }

  return { poiPlaces, searchPOIPlaces, selectedPOIPlace, selectPOIPlace, reset }
}
