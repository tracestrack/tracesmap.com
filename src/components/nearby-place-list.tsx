import { Flex, Item, ListBox, View, type Selection } from '@adobe/react-spectrum'
import { useMemo } from 'react'
import { hooks } from '../hooks'

export function NearbyPlaceList() {
  const { selectedNearbyPlace, selectNearbyPlace } = hooks.search.useNearbyPlaces()
  const { nearbyPlaces } = hooks.search.useNearbyPlaces()

  const selectedNearbyPlaceItems = useMemo<Selection>(() => {
    let a = []
    if (selectedNearbyPlace?.id !== undefined) a = [String(selectedNearbyPlace.id)]
    return new Set(a)
  }, [selectedNearbyPlace])

  const onSelectNearbyItem = s => {
    const [n] = s.values()
    if (n === undefined) return

    selectNearbyPlace(n)
  }

  const isHidden = nearbyPlaces.length === 0

  return (
    <Flex isHidden={isHidden} position="absolute" right="size-350" alignItems="center" height="100%">
      <View backgroundColor="default" borderRadius="regular">
        <Flex maxHeight="size-4600">
          <ListBox
            marginX="size-75"
            marginY="size-50"
            width="size-2400"
            aria-label="select nearby places"
            selectionMode="single"
            items={nearbyPlaces}
            selectedKeys={selectedNearbyPlaceItems}
            onSelectionChange={onSelectNearbyItem}
          >
            {v => <Item key={v.id}>{v.name}</Item>}
          </ListBox>
        </Flex>
      </View>
    </Flex>
  )
}
