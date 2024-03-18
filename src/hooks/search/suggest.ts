import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { api } from '../../api'
import { type SearchReturn } from '../../api/search'
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
        res.map(({ data, position, display_name }) => ({
          id: data?.place_id,
          coordinate: [position?.[1], position?.[0]],
          name: display_name,
        })),
      )

      return res
    } catch (e) {
      console.error(e)
    }
  }

  return { suggest, suggestions }
}
