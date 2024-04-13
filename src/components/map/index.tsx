import { hooks } from '../../hooks'
import { ContextMenu } from './context-menu'
import { Coordinates } from './coordinates'
import styles from './index.module.css'

export function Map() {
  hooks.map.useMap({ target: styles.map })

  hooks.map.useBaseLayer()
  hooks.map.useOverlayLayer()
  hooks.map.useLanguageLayer()
  hooks.map.usePositionPointLayer()
  hooks.map.useDirectionLayer()
  hooks.map.useSearchLayer()
  hooks.map.useNearbyPlacesLayer()
  hooks.map.usePOIPlacesLayer()
  hooks.map.useSuggestionPlacesLayer()

  hooks.map.useMapEvents()

  return (
    <>
      <div id={styles.map} />
      <ContextMenu />
      <Coordinates />
    </>
  )
}
