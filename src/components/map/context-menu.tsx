import { Item, Menu, Section, View } from '@adobe/react-spectrum'
import { useEffect, useRef } from 'react'
import { hooks } from '../../hooks'

const actionKeys = ['0', '1', '2', '3'] as const
type ActionKey = (typeof actionKeys)[number]

export function ContextMenu() {
  const ref = useRef<any>()
  const { open, setOpen, position } = hooks.map.useContextMenu()
  const [pinPosition] = hooks.map.usePinPosition()
  const direction = hooks.map.useDirection()
  const { searchNearbyPlaces, reset: resetNearby } = hooks.search.useNearbyPlaces()
  const { searchPOIPlaces, reset: resetPOI } = hooks.search.usePOIPlaces()

  const onAction = (key: ActionKey) => {
    if (key === '0') {
      searchNearbyPlaces(pinPosition)
      resetPOI()
    }

    if (key === '1') {
      searchPOIPlaces(pinPosition)
      resetNearby()
    }

    if (key === '2') direction.setStart(pinPosition)
    if (key === '3') direction.setEnd(pinPosition)
  }

  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.UNSAFE_getDOMNode().contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  return (
    <View
      ref={ref}
      isHidden={!open}
      left={position?.x}
      top={position?.y}
      position="absolute"
      backgroundColor="default"
      borderRadius="regular"
    >
      <Menu marginX="size-100" aria-label="map context menu" onAction={onAction} onClose={() => setOpen(false)}>
        <Section>
          <Item key="0">{hooks.locale.useTranslate('Show Nearby Places')}</Item>
          <Item key="1">{hooks.locale.useTranslate('Show Nearby POIs')}</Item>
        </Section>
        <Section>
          <Item key="2">{hooks.locale.useTranslate('Direction from here')}</Item>
          <Item key="3">{hooks.locale.useTranslate('Direction to here')}</Item>
        </Section>
      </Menu>
    </View>
  )
}
