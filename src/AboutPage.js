import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AboutPage.css';

function AboutPage({show, hide}) {

  return (<Modal
            show={show}
            onHide={hide}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
                {window.l("About & Help")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>{window.l("Acknowledgement")}</h4>
              <p><small>
                   Map data: © OpenStreetMap contributors <br />

                   Map style: based on <a href="https://github.com/gravitystorm/openstreetmap-carto">OpenStreetMap Carto</a><br />

                   Satellite service provider: <a href="https://www.mapbox.com">Mapbox</a> <br/>

                   Search service: <a href="https://nominatim.org/">Nominatim</a> <br />

                   Map framework: <a href="http://openlayers.org">OpenLayers</a> <br/>

                   Query service: <a href="http://overpass-api.de">Overpass API</a> <br/>

                   Routing: <a href="https://openrouteservice.org">OpenRouteService</a> <br />

                   Traffic: <a href="https://www.tomtom.com">TomTom</a> <br />

                   Icons: <b><a href="https://www.flaticon.com/free-icon/paifang_2675611">Paifang</a> from <a href="https://www.flaticon.com/authors/good-ware">Good Ware</a></b>

                   Maintainer: Qing Cai <br />

                   Like to use the map tiles? Check out <a href="https://www.tracestrack.com/tiles/">Tracestrack Tile Service</a> <br />

                   Contact: <b>[tracestrack@icloud.com] </b> <br />

                 </small>              </p>

              <h4>{window.l("Privacy")}</h4>
              <p>
                We do not collect user data. Cookies are used only to save user preferences.
              </p>

              <h4>{window.l("Quick tips")}</h4>
              <ol>
                <small>
                <li>Paste URL of openstreetmap.org and Google Maps to search bar to quick jump</li>
                <li>Press F1 to refresh map tiles if you see out-dated map</li>
                <li>Press F2 to toggle between Satellite and Street view</li>
                <li>Press F3 to open Openstreetmap.org</li>
                <li>Press F4 to edit in Openstreetmap.org</li>
                <li>Press F12 to open in map.baidu.com</li>
                </small>
              </ol>

              <h4>{window.l("Other Information")}</h4>
              <p><small>
                   <a href="https://stats.uptimerobot.com/505xMU0mq4">Service Status</a> <br />

                   Please use a modern browser such as Chrome, Edge, Opera, Safari, Firefox. Chromium based browsers are recommended. <br />
                   Some map tiles are generated on the fly, which could be slow. <br />
                   Tracestrack Maps is GPU-intensive, especially with more layers. <br />
                 </small>
              </p>
            </Modal.Body>
          </Modal>);
};

export default AboutPage;
