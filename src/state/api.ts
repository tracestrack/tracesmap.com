import { atom } from 'recoil'
import { type SearchReturn } from '../api/search'

export const suggestion = atom<SearchReturn[]>({
  key: 'api.suggestion',
  default: [],
})

export const api = { suggestion }
