import { atom } from 'recoil'
import { type Suggestions } from '../api/search'

export const suggestions = atom<Suggestions>({
  key: 'api.suggestions',
  default: [],
})

export const api = { suggestions }
