import { Content, Dialog, Divider, Heading } from '@adobe/react-spectrum'
import { hooks } from '../hooks'

export function AboutDialog() {
  return (
    <Dialog>
      <Heading>{hooks.locale.useTranslate('About & Help')}</Heading>
      <Divider />
      <Content>
        <h3>{hooks.locale.useTranslate('Acknowledgement')}</h3>
        <p>
          Tracesmap is an open source project that makes plenty use of openstreetmap based data. It's open sourced on
          <a href="https://github.com/tracestrack/tracesmap.com">Github</a>. You are welcome to open issues and pull
          requests.
        </p>
        <p>
          Map data: © OpenStreetMap contributors, © ESA WorldCover project / Contains modified Copernicus Sentinel
          data (2021) processed by ESA WorldCover consortium, NASADEM, SRTM <br />
          Map style: <a href="https://www.tracestrack.com/information/">Tracestrack Tile Style</a> based on{' '}
          <a href="https://github.com/gravitystorm/openstreetmap-carto">OpenStreetMap Carto</a> and{' '}
          <a href="https://opentopomap.org/">OpenTopoMap</a>
          <br />
          Railway overlays: <a href="https://www.openrailwaymap.org/">OpenRailwayMap</a>
          <br />
          Satellite service provider: <a href="https://www.mapbox.com">Mapbox</a>
          <br />
          Search service: <a href="https://nominatim.org/">Nominatim</a>
          <br />
          Map framework: <a href="http://openlayers.org">OpenLayers</a>
          <br />
          Geo-query service: <a href="http://overpass-api.de">Overpass API</a>
          <br />
          Routing: <a href="https://openrouteservice.org">OpenRouteService</a>
          <br />
          Traffic: <a href="https://www.tomtom.com">TomTom</a>
          <br />
          Some map icon credit: See <a href="https://www.tracestrack.com/information/">Tracestrack Tile Style</a>
          <br />
          Like to use the map tile service? Check out{' '}
          <a href="https://www.tracestrack.com/">Tracestrack Tile Service</a>
          <br />
          Contact: <b>info@tracestrack.com</b>
          <br />
        </p>
        <h3>{hooks.locale.useTranslate('Privacy')}</h3>
        <p>We do not collect user data. Cookies are used only to save user preferences.</p>
        <h3>{hooks.locale.useTranslate('Quick tips')}</h3>
        <ol className="list-group list-group-flush">
          <small>
            <li className="list-group-item">
              Paste URLs with <b>[z]/[latitude]/[longitude]</b> part (e.g.
              https://www.openstreetmap.org/#map=6/44.462/20.355) to search bar for quick jumping. Google Maps URL is
              also supported.
            </li>
            <li className="list-group-item">Press F2 to toggle between Satellite and Street view</li>
            <li className="list-group-item">Press F4 to open openstreetmap.org</li>
            <li className="list-group-item">Press F6 to edit in openstreetmap.org</li>
            <li className="list-group-item">Press F12 to open in map.baidu.com</li>
          </small>
        </ol>
      </Content>
    </Dialog>
  )
}
