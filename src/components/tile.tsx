import { ToggleButton, View } from '@adobe/react-spectrum'
import type { FunctionComponent } from 'react'
import { useState } from 'react'
import { Layers } from './icon'
import { TilePanel } from './tile-panel'

interface TileProps {}

export const Tile: FunctionComponent<TileProps> = props => {
  let [tilePanelOpen, setTilePanelOpen] = useState(false)

  return (
    <View position="absolute" bottom="size-400" left="size-350">
      <ToggleButton isEmphasized isSelected={tilePanelOpen} onChange={setTilePanelOpen}>
        <Layers />
      </ToggleButton>
      <TilePanel open={tilePanelOpen} />
    </View>
  )
}
