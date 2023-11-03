import { defaultTheme, Provider } from '@adobe/react-spectrum'
import { Map } from './components/map'
import { NearbyPlaceList } from './components/nearby-place-list'
import { Search } from './components/search'
import { Tile } from './components/tile'
import { POIPlaceList } from './components/poi-place-list'

export function Layout() {
  return (
    <Provider theme={defaultTheme} position="absolute" height="100%" width="100%">
      <Map />
      <Search />
      <Tile />
      <NearbyPlaceList />
      <POIPlaceList />
    </Provider>
  )
}
