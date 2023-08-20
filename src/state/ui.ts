import { atom } from 'recoil'
import { variables, type UILanguage } from '../variables'
import { effects } from './effects'

export const language = atom<UILanguage>({
  key: 'ui.language',
  default: variables.defaultUILanguage,
  effects: [effects.localStoragePersistence(variables.localStorageKey.uiLanguage)],
})

export const ui = { language }
