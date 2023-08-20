import { useRecoilState } from 'recoil'
import { state } from '../state'
import type { UILanguage } from '../variables'

interface useSettingsValue {
  language?: UILanguage
}

type useSettingsSetValue = (o: useSettingsValue) => void

export function useSettings(): [useSettingsValue, useSettingsSetValue] {
  const [language, setLanguage] = useRecoilState(state.ui.language)

  const settings: useSettingsValue = {
    language,
  }

  const setSettings: useSettingsSetValue = o => {
    if (o.language) setLanguage(o.language)
  }

  return [settings, setSettings]
}

export const ui = { useSettings }
