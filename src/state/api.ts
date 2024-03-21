import { atom } from 'recoil'
import { type SuggestionPlaces } from '../api/search'

export const suggestion = atom<SuggestionPlaces>({
  key: 'api.suggestion',
  default: [],
})

export const api = { suggestion }
