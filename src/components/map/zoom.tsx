import { ActionGroup, Item } from '@adobe/react-spectrum'
import { hooks } from '../../hooks'
import { Add, Remove } from '../icon'

export function Zoom() {
  const { zoomIn, zoomOut } = hooks.map.useControl()

  const zoomActions = {
    zoomIn,
    zoomOut,
  }

  const onZoom = (k: keyof typeof zoomActions) => zoomActions[k]()

  return (
    <ActionGroup position="absolute" bottom="size-400" right="size-350" onAction={onZoom} orientation="vertical">
      <Item key="zoomIn">
        <Add />
      </Item>
      <Item key="zoomOut">
        <Remove />
      </Item>
    </ActionGroup>
  )
}
