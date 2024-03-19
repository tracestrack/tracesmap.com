import { useRecoilState } from 'recoil'
import { api } from '../../api'
import { state } from '../../state'
import { variables, type SearchServiceKey } from '../../variables'
import { useSuggestPlace } from './suggest-place'

export function useSuggest() {
  const [suggestions, setSuggestions] = useRecoilState(state.api.suggestion)

  const { setSuggestionPlaces, reset: resetSuggestionPlaces } = useSuggestPlace()

  const suggest = async (q, s: SearchServiceKey = variables.searchService[0].key) => {
    try {
      const res = await api.search({ q }, s)
      setSuggestions(res)

      resetSuggestionPlaces()
      setSuggestionPlaces(
        res.map(({ id, lat, lon, name }) => ({
          id,
          coordinate: [lon, lat],
          name,
        })),
      )

      return res
    } catch (e) {
      console.error(e)
    }
  }

  return { suggest, suggestions }
}
