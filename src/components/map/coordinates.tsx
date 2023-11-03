import { Flex, View, Text } from '@adobe/react-spectrum'
import { hooks } from '../../hooks'
import { variables } from '../../variables'

export function Coordinates() {
  const [positionPoint] = hooks.map.usePinPosition()
  if (!positionPoint) return null
  return (
    <Flex
      UNSAFE_style={{ pointerEvents: 'none' }}
      position="absolute"
      bottom="size-100"
      left={0}
      right={0}
      justifyContent="center"
    >
      <View
        UNSAFE_style={{ pointerEvents: 'initial' }}
        backgroundColor="default"
        paddingY="size-100"
        paddingX="size-200"
        borderRadius="regular"
      >
        <Text>{positionPoint.map(v => v.toFixed(variables.coordinateFixed)).join(', ')}</Text>
      </View>
    </Flex>
  )
}
