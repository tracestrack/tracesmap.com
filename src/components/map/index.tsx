import { hooks } from '../../hooks'
import { ContextMenu } from './context-menu'
import { Coordinates } from './coordinates'
import styles from './index.module.css'
import { Zoom } from './zoom'

export function Map() {
  hooks.map.useMap({ target: styles.map })

  hooks.map.useBaseLayer()
  hooks.map.useOverlayLayer()
  hooks.map.useLanguageLayer()
  hooks.map.usePositionPointLayer()
  hooks.map.useDirectionLayer()
  hooks.map.useNearbyPlacesLayer()
  hooks.map.useSearchLayer()
  hooks.map.useAddSearchPoint()
  hooks.map.usePOIPlacesLayer()

  hooks.map.useMapEvents()

  return (
    <>
      <div id={styles.map} />
      <ContextMenu />
      <Coordinates />
    </>
  )
}
