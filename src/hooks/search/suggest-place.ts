import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { state } from '../../state'
import { type Place } from '../../state/map'

export function useSuggestPlace() {
  const [suggestionPlaces, setSuggestionPlaces] = useRecoilState(state.map.suggestionPlaces)
  const [selectedSuggestionPlace, setSelectedSuggestionPlace] = useRecoilState(state.map.selectedSuggestionPlace)
  const resetSelectedSuggestionPlace = useResetRecoilState(state.map.selectedSuggestionPlace)
  const resetSuggestionPlaces = useResetRecoilState(state.map.suggestionPlaces)

  const selectSuggestionPlace = (id: Place['id']) => setSelectedSuggestionPlace(suggestionPlaces.find(v => v.id == id))

  const reset = () => {
    resetSuggestionPlaces()
    resetSelectedSuggestionPlace()
  }

  return { suggestionPlaces, setSuggestionPlaces, selectedSuggestionPlace, selectSuggestionPlace, reset }
}
