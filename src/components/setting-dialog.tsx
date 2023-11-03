import { Content, Dialog, Divider, Heading, Item, Picker } from '@adobe/react-spectrum'
import { hooks } from '../hooks'
import { variables, type MapLanguage, type UILanguage } from '../variables'

export const uiLanguages: { id: UILanguage; name: string }[] = [
  { name: 'Dutch / Nederlands', id: 'nl-NL' },
  { name: 'English', id: 'en-US' },
  { name: 'French / Français', id: 'fr-FR' },
  { name: 'Simplified Chinese / 简体中文', id: 'zh-CN' },
]

export const mapLanguages: { id: MapLanguage; name: string }[] = [
  { name: 'Auto', id: 'auto-name' },
  { name: 'Global *', id: '_-name' },
  { name: 'عربي', id: 'ar-name' },
  { name: 'Deutsch', id: 'de-name' },
  { name: 'English *', id: 'en-name' },
  { name: 'español', id: 'es-name' },
  { name: 'suomen kieli', id: 'fi-name' },
  { name: 'Français', id: 'fr-name' },
  { name: 'magyar nyelv', id: 'hu-name' },
  { name: 'עִבְרִית‎', id: 'he-name' },
  { name: 'italiano', id: 'it-name' },
  { name: '日本語', id: 'ja-name' },
  { name: '한국어', id: 'ko-name' },
  { name: 'Nederlands', id: 'nl-name' },
  { name: 'український', id: 'uk-name' },
  { name: 'polski', id: 'pl-name' },
  { name: 'português', id: 'pt-name' },
  { name: 'русский', id: 'ru-name' },
  { name: 'Svenska', id: 'sv-name' },
  { name: 'Türkçe', id: 'tr-name' },
  { name: 'แบบไทย', id: 'th-name' },
  { name: '简体中文', id: 'zh-hans-name' },
  { name: '繁體中文', id: 'zh-hant-name' },
]

const localStorageItems = [variables.localStorageKey.mapLanguage, variables.localStorageKey.uiLanguage]

export function SettingDialog() {
  const [mapSettings, setMapSettings] = hooks.map.useSettings()
  const [uiSettings, setUISettings] = hooks.ui.useSettings()

  const onChangeLanguage = function (s) {
    setMapSettings({ language: s })
    localStorage.setItem(localStorageItems[0], s)
  }

  const onChangeUILanguage = function (s) {
    setUISettings({ language: s })
    localStorage.setItem(localStorageItems[1], s)
  }

  return (
    <Dialog>
      <Heading>{hooks.locale.useTranslate('Settings')}</Heading>
      <Divider />
      <Content>
        <h3>Interface Languages</h3>
        <Picker
          aria-label="nterface languages"
          items={uiLanguages}
          onSelectionChange={onChangeUILanguage}
          selectedKey={uiSettings.language}
        >
          {v => <Item>{v.name}</Item>}
        </Picker>
        <h3>{hooks.locale.useTranslate('Languages')}</h3>
        <p>{hooks.locale.useTranslate('Languages with * has full zoom levels.')}</p>
        <Picker
          aria-label={hooks.locale.useTranslate('Languages')}
          items={mapLanguages}
          onSelectionChange={onChangeLanguage}
          selectedKey={mapSettings.language}
        >
          {v => <Item>{v.name}</Item>}
        </Picker>
      </Content>
    </Dialog>
  )
}
