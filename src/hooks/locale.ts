import i18n, { i18nConfig } from 'es2015-i18n-tag'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import enUS from '../locales/en-US.json'
import frFR from '../locales/fr-FR.json'
import nlNL from '../locales/nl-NL.json'
import zhCN from '../locales/zh-CN.json'
import { state } from '../state'

const locales = {
  'zh-CN': zhCN,
  'nl-NL': nlNL,
  'fr-FR': frFR,
  'en-US': enUS,
}

export function useTranslate(key: string, ...values: Array<any>) {
  const [text, setText] = useState(key)
  const language = useRecoilValue(state.ui.language)

  useEffect(() => {
    i18nConfig({ translations: locales[language] })
  }, [language])

  useEffect(() => {
    const t = i18n.translate(key, ...values)
    if (text !== t) setText(t)
  }, [key, values])

  return text
}

export const locale = { useTranslate }
