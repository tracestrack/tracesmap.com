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
                About & Help
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>Acknowledgement</h4>
              <p><small>
                   Map data: © OpenStreetMap contributors <br />

                   Map style: based on <a href="https://github.com/gravitystorm/openstreetmap-carto">OpenStreetMap Carto</a><br />

                   Satellite service provider: <a href="https://www.mapbox.com">Mapbox</a> <br/>

                   Search service: <a href="https://nominatim.org/">Nominatim</a> <br />

                   Map framework: <a href="http://openlayers.org">OpenLayers</a> <br/>

                   Query service: <a href="http://overpass-api.de">Overpass API</a> <br/>

                   Routing: <a href="https://openrouteservice.org">OpenRouteService</a> <br />

                   Maintainer: Qing Cai <br />

                   Like to use the map tiles? Check out <a href="https://www.tracestrack.com/tiles/">Tracestrack Tile Service</a> <br />

                   Contact: <b>[tracestrack@icloud.com]</b>

                 </small>              </p>

              <h4>Privacy</h4>
              <p>
                We do not harvest or analyze user data in any way. Cookies is used only to save user preferences locally.
              </p>

              <h4>Quick tips</h4>
              <ol>
                <small>
                <li>Paste URL of openstreetmap.org and Google Maps to search bar to quick jump</li>
                <li>Press F2 to toggle between Satellite and Street view</li>
                <li>Press F3 to open Openstreetmap.org</li>
                <li>Press F4 to edit in Openstreetmap.org</li>
                <li>Press F12 to open in map.baidu.com</li>
                </small>
              </ol>

              <h4>Other Information</h4>
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
