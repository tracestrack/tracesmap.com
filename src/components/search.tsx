import {
  ActionButton,
  DialogTrigger,
  Flex,
  Item,
  ListBox,
  Picker,
  SearchField,
  ToggleButton,
  Tooltip,
  TooltipTrigger,
  View,
} from '@adobe/react-spectrum'
import lodash from 'lodash'
import { useEffect, useState } from 'react'
import { hooks } from '../hooks'
import { variables } from '../variables'
import { AboutDialog } from './about-dialog'
import { DirectionPanel } from './direction-panel'
import { AnchorSelect, InfoOutline, Settings } from './icon'
import { SettingDialog } from './setting-dialog'
import { styleVariables } from './style-variable'

export function Search() {
  const [searchText, setSearchText] = useState('')
  const [searchService, setSearchService] = useState<any>(variables.searchService[0].key)
  const [suggestionStatus, setSuggestionStatus] = useState<'on' | 'off'>('on')
  const [suggestionItems, setSuggestionItems] = useState([])
  const [directionPanelOpen, setDirectionPanelOpen] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState([])

  const { suggest, suggestions } = hooks.search.useSuggest()
  const { setSearchResultPosition, setBoundingBox } = hooks.map.useControl()

  const suggestionHidden = lodash.isEmpty(suggestionItems)

  useEffect(() => {
    if (searchText === '') return
    if (suggestionStatus === 'off') return
    debouncedSuggest(searchText, searchService)
  }, [searchText, suggestionStatus])

  useEffect(() => {
    const arr = suggestions.map((v, i) => ({ id: i, name: v.display_name }))
    setSuggestionItems(arr)
  }, [suggestions])

  const debouncedSuggest = lodash.debounce(suggest, 300)

  const onChangeSearchText = s => {
    debouncedSuggest?.cancel()

    setSuggestionStatus('on')
    setSearchText(s)
  }

  const onSelectSuggestion = s => {
    setSuggestionStatus('off')
    setSuggestionItems([])

    const [n] = s.values()
    if (n === undefined) return

    const { display_name, data, viewport, position } = suggestions[n]

    setSearchText(display_name)
    setSelectedSuggestions([s])

    // setSearchResultPosition(position[0], position[1] );
    setBoundingBox({ lat: viewport[0][0], lon: viewport[0][1] }, { lat: viewport[1][0], lon: viewport[1][1] })
  }

  return (
    <Flex
      position="absolute"
      direction="column"
      width={{ base: 'size-5000', L: '600px' }}
      top="size-400"
      left="size-350"
    >
      <View
        backgroundColor="gray-200"
        flex="1"
        paddingY="size-85"
        paddingX="size-100"
        borderRadius="medium"
        UNSAFE_style={{ opacity: styleVariables.floatingPanelOpacity }}
      >
        <Flex gap="size-65">
          <TooltipTrigger>
            <ToggleButton isEmphasized isSelected={directionPanelOpen} onChange={setDirectionPanelOpen}>
              <AnchorSelect />
            </ToggleButton>
            <Tooltip>Direction</Tooltip>
          </TooltipTrigger>
          <View flex="1" position="relative" zIndex={1000}>
            <SearchField
              width="100%"
              aria-label="search"
              icon={null}
              value={searchText}
              onChange={onChangeSearchText}
            />
            <View
              top="100%"
              width="100%"
              isHidden={suggestionHidden}
              position="absolute"
              backgroundColor="static-white"
              borderRadius="regular"
              marginTop="size-50"
            >
              <ListBox
                marginX="size-50"
                aria-label="suggestion"
                items={suggestionItems}
                selectedKeys={selectedSuggestions}
                selectionMode="single"
                onSelectionChange={onSelectSuggestion}
                disallowEmptySelection
              >
                {item => <Item>{item.name}</Item>}
              </ListBox>
            </View>
          </View>
          <Picker
            width={{ base: 'size-1000', M: 'size-2000', L: 'size-2000' }}
            aria-label="select search service"
            selectedKey={searchService}
            onSelectionChange={s => setSearchService(s)}
          >
            {variables.searchService.map(v => (
              <Item key={v.key}>{v.name}</Item>
            ))}
          </Picker>
          <DialogTrigger isDismissable>
            <ActionButton>
              <TooltipTrigger>
                <Settings />
                <Tooltip>Settings</Tooltip>
              </TooltipTrigger>
            </ActionButton>
            <SettingDialog />
          </DialogTrigger>
          <DialogTrigger isDismissable>
            <ActionButton>
              <TooltipTrigger>
                <InfoOutline />
                <Tooltip>About & Help</Tooltip>
              </TooltipTrigger>
            </ActionButton>
            <AboutDialog />
          </DialogTrigger>
        </Flex>
        <DirectionPanel open={directionPanelOpen} />
      </View>
    </Flex>
  )
}
