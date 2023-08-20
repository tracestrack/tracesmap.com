import { Flex, Item, ListBox, View, type Selection } from '@adobe/react-spectrum'
import { useMemo } from 'react'
import { hooks } from '../hooks'

export function POIPlaceList() {
  const { selectedPOIPlace, selectPOIPlace } = hooks.search.usePOIPlaces()
  const { poiPlaces } = hooks.search.usePOIPlaces()

  const selectedPOIPlaceItems = useMemo<Selection>(() => {
    let a = []
    if (selectedPOIPlace?.id !== undefined) a = [String(selectedPOIPlace.id)]
    return new Set(a)
  }, [selectedPOIPlace])

  const onSelectPOIItem = s => {
    const [n] = s.values()
    if (n === undefined) return

    selectPOIPlace(n)
  }

  const isHidden = poiPlaces.length === 0

  return (
    <Flex isHidden={isHidden} position="absolute" right="size-350" alignItems="center" height="100%">
      <View backgroundColor="default" borderRadius="regular">
        <Flex maxHeight="size-4600">
          <ListBox
            marginX="size-75"
            marginY="size-50"
            width="size-2400"
            aria-label="select poi places"
            selectionMode="single"
            items={poiPlaces}
            selectedKeys={selectedPOIPlaceItems}
            onSelectionChange={onSelectPOIItem}
          >
            {v => <Item key={v.id}>{v.name}</Item>}
          </ListBox>
        </Flex>
      </View>
    </Flex>
  )
}
