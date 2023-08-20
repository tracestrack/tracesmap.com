import {
  ActionButton,
  ActionGroup,
  Flex,
  Item,
  LabeledValue,
  Menu,
  MenuTrigger,
  TextField,
  View,
} from '@adobe/react-spectrum'
import { useEffect, useRef, useState } from 'react'
import { hooks } from '../hooks'
import type { Direction } from '../variables'

const directionsMethods: { id: Direction; name: string }[] = [
  { id: 'driving-car', name: 'Driving' },
  { id: 'cycling-regular', name: 'Cycling' },
  { id: 'cycling-mountain', name: 'Cycling MTB' },
  { id: 'foot-walking', name: 'Walking' },
  { id: 'foot-hiking', name: 'Hiking' },
]

const locationInteraction = [
  { id: '0', name: 'Click on map' },
  { id: '1', name: 'Use current location' },
] as const

interface DirectionPanelProps {
  open: boolean
}

const a2s = (a: number[]) => (a === undefined || (a[0] === 0 && a[1] === 0) ? '' : `${a[0]},${a[1]}`)

const s2a = (v: string) => {
  const [a, b] = v.split(',').map(v => Number(v))
  const f = v => typeof v === 'number' && !isNaN(v)
  if (!f(a) || !f(b)) return undefined
  return [a, b]
}

export function DirectionPanel(props: DirectionPanelProps) {
  const { direction, start, end, setDirection, setStart, setEnd, duration, distance } = hooks.map.useDirection()
  const directionInteraction = hooks.map.useDirectionInteraction()
  const addDirectionRoute = hooks.map.useAddDirectionRoute()

  const startFieldRef = useRef<any>()
  const endFieldRef = useRef<any>()

  const onChangeStartField = v => setStart(s2a(v))
  const onChangeEndField = v => setEnd(s2a(v))

  useEffect(() => {
    if (start && startFieldRef) startFieldRef.current.getInputElement().value = a2s(start)
    if (end && endFieldRef) endFieldRef.current.getInputElement().value = a2s(end)
  }, [start, end])

  const [field, setField] = useState<'from' | 'to' | undefined>()
  const [_, getCurrentPosition] = hooks.map.useGetCurrentPosition()

  const onClickMenuFn = (s: typeof field) => (key: (typeof locationInteraction)[number]['id']) => {
    setField(s)

    if (key === '0') {
      if (s === 'from') directionInteraction('from')
      if (s === 'to') directionInteraction('to')
    }

    if (key === '1') {
      getCurrentPosition(c => {
        if (s === 'from') setStart(c)
        if (s === 'to') setEnd(c)
      })
    }
  }

  const onChangeDirection = ({ currentKey }: never) => {
    setDirection(currentKey)
  }

  useEffect(() => {
    if (direction && start && end) addDirectionRoute(start, end)
    if (start) setStart(start)
    if (end) setEnd(end)
  }, [direction, start, end])

  return (
    <View marginTop="size-85" isHidden={!props.open}>
      <ActionGroup
        isEmphasized
        aria-label={hooks.locale.useTranslate('Direction Method')}
        density="compact"
        selectionMode="single"
        selectedKeys={new Set([direction])}
        onSelectionChange={onChangeDirection}
      >
        {directionsMethods.map(v => (
          <Item key={v.id}>{hooks.locale.useTranslate(v.name)}</Item>
        ))}
      </ActionGroup>
      <Flex marginTop="size-85" gap="size-100">
        <Flex flex={1} gap="size-65">
          <MenuTrigger aria-label={hooks.locale.useTranslate('From')}>
            <ActionButton>{hooks.locale.useTranslate('From')}</ActionButton>
            <Menu onAction={onClickMenuFn('from')}>
              {locationInteraction.map(v => (
                <Item key={v.id}>{hooks.locale.useTranslate(v.name)}</Item>
              ))}
            </Menu>
          </MenuTrigger>
          <TextField
            flex={1}
            width="auto"
            aria-label={hooks.locale.useTranslate('From')}
            ref={startFieldRef}
            onChange={onChangeStartField}
          />
        </Flex>
        <Flex flex={1} gap="size-65">
          <MenuTrigger aria-label={hooks.locale.useTranslate('To')}>
            <ActionButton>{hooks.locale.useTranslate('To')}</ActionButton>
            <Menu onAction={onClickMenuFn('to')}>
              {locationInteraction.map(v => (
                <Item key={v.id}>{hooks.locale.useTranslate(v.name)}</Item>
              ))}
            </Menu>
          </MenuTrigger>
          <TextField
            flex={1}
            width="auto"
            aria-label={hooks.locale.useTranslate('To')}
            ref={endFieldRef}
            onChange={onChangeEndField}
          />
        </Flex>
      </Flex>
      <Flex marginTop="size-85" gap="size-100">
        {distance !== undefined && (
          <LabeledValue
            label="Distance"
            value={distance}
            labelPosition="side"
            formatOptions={{ style: 'unit', unit: 'kilometer' }}
          />
        )}
        {duration !== undefined && (
          <LabeledValue
            label="Duration"
            value={duration}
            labelPosition="side"
            formatOptions={{ style: 'unit', unit: 'minute' }}
          />
        )}
      </Flex>
    </View>
  )
}
