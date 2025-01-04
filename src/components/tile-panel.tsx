import { ActionGroup, Flex, Item, View } from '@adobe/react-spectrum'
import lodash from 'lodash'
import type { FunctionComponent } from 'react'
import { hooks } from '../hooks'
import type { MapBaseLayer, MapOverlayLayer, MapStyle } from '../variables'
import { styleVariables } from './style-variable'

interface TilePanelProps {
  open?: boolean
}

export const TilePanel: FunctionComponent<TilePanelProps> = props => {
  const [mapSettings, setMapSettings] = hooks.map.useSettings()

  const onChangeOverlay = x => setMapSettings({ overlayLayer: x.anchorKey })
  const onChangeStyle = x => setMapSettings({ style: x.anchorKey })
  const onChangeBase = x => setMapSettings({ baseLayer: x.anchorKey })

  return (
    <View
      position="absolute"
      bottom="size-500"
      left={0}
      backgroundColor="gray-200"
      paddingY="size-85"
      paddingX="size-100"
      borderRadius="medium"
      UNSAFE_style={{ opacity: styleVariables.floatingPanelOpacity }}
      isHidden={!props.open}
    >
      <Flex direction="column" gap="size-65">
        <ActionGroup
          isEmphasized
          aria-label="Overlay"
          density="compact"
          selectionMode="single"
          selectedKeys={[mapSettings.overlayLayer]}
          onSelectionChange={onChangeOverlay}
        >
          {lodash.keys(mapOverlays).map(v => (
            <Item key={v}>{hooks.locale.useTranslate(mapOverlays[v])}</Item>
          ))}
        </ActionGroup>
        <ActionGroup
          isEmphasized
          aria-label="Style"
          density="compact"
          selectionMode="single"
          selectedKeys={[mapSettings.style]}
          onSelectionChange={onChangeStyle}
        >
          {lodash.keys(mapStyles).map(v => (
            <Item key={v}>{hooks.locale.useTranslate(mapStyles[v])}</Item>
          ))}
        </ActionGroup>
        <ActionGroup
          isEmphasized
          aria-label="Base Map"
          density="compact"
          selectionMode="single"
          selectedKeys={[mapSettings.baseLayer]}
          onSelectionChange={onChangeBase}
        >
          {lodash.keys(mapBaseLayer).map(v => (
            <Item key={v}>{hooks.locale.useTranslate(mapBaseLayer[v])}</Item>
          ))}
        </ActionGroup>
      </Flex>
    </View>
  )
}

const mapOverlays: Record<MapOverlayLayer, string> = {
  none: 'None',
  traffic: 'Traffic',
  gps: 'GPS',
  'orm-infra': 'ORM Infrastructure',
  'orm-speed': 'ORM Max Speed',
}

const mapStyles: Record<MapStyle, string> = {
  normal: 'Normal',
  grayscale: 'Grayscale',
  vivid: 'Vivid',
  dark: 'Dark',
}

const mapBaseLayer: Partial<Record<MapBaseLayer, string>> = {
  street: 'Street',
  satellite: 'Satellite',
  topo: 'Topo',
  transport: 'Transport',
}
