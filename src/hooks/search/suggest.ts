import { useState } from 'react'
import { SearchReturn } from 'src/api/search'
import { api } from '../../api'
import { variables, type SearchServiceKey } from '../../variables'

export function useSuggest() {
  const [suggestions, setSuggestions] = useState<SearchReturn[]>([])

  const suggest = async (q, s: SearchServiceKey = variables.searchService[0].key) => {
    try {
      const res = await api.search({ q }, s)
      setSuggestions(res)
      return res
    } catch (e) {
      console.error(e)
    }
  }

  return { suggest, suggestions }
}
