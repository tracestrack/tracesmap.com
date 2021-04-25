import { Modal, Card } from 'react-bootstrap';
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
              <h3>Acknowledgement</h3>
              <p>
                Map data: © OpenStreetMap contributors <br />

                Map style: <a href="https://github.com/gravitystorm/openstreetmap-carto">OpenStreetMap Carto</a><br />

                Search is powered by <a href="https://nominatim.org/">Nominatim</a> <br />

                Map framework is powered by <a href="http://openlayers.org">OpenLayers</a> <br/>

                Dynamic data is powered by <a href="http://overpass-api.de">Overpass API</a> <br/>

                Maintainer: Qing Cai [hello (at) tracestrack.com]<br />

              </p>

              <h3>Privacy</h3>
              <p>
                We do not harvest or analyze user data in any way. Cookies is used only to save user preferences locally.
              </p>


              <h3>Other information</h3>
              <p>
                Map refresh period: 1 to 7 days <br />
              </p>
            </Modal.Body>
          </Modal>);
};

export default AboutPage;
