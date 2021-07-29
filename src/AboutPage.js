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
                About
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>Acknowledgement</h4>
              <p><small>
                   Map data: © OpenStreetMap contributors <br />

                   Map style: based on <a href="https://github.com/gravitystorm/openstreetmap-carto">OpenStreetMap Carto</a><br />

                   Search: <a href="https://nominatim.org/">Nominatim</a> <br />

                   Map framework: <a href="http://openlayers.org">OpenLayers</a> <br/>

                   Dynamic data: <a href="http://overpass-api.de">Overpass API</a> <br/>

                   Routing: <a href="https://openrouteservice.org">OpenRouteService</a> <br />

                   Curator: Qing Cai <br />

                   Support the project: <a href="https://www.patreon.com/tracestrack">Patreon</a> <br />

                   Contact: <b>[tracestrack@icloud.com]</b>

                 </small>              </p>

              <h4>Privacy</h4>
              <p>
                We do not harvest or analyze user data in any way. Cookies is used only to save user preferences locally.
              </p>


              <h4>Other information</h4>
              <p><small>
                   Map refreshing period: 1 to 7 days. Usually 3 days. <br />
                   Please use a modern browser such as Chrome, Edge, Opera, Safari, Firefox. Chromium based browsers are recommended. <br />
                   Some map tiles are generated on the fly, which could be slow. <br />
                 </small>
              </p>
            </Modal.Body>
          </Modal>);
};

export default AboutPage;
