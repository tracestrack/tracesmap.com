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

                   Dynamic data is powered by <a href="http://overpass-api.de">Overpass API</a> <br/>

                   Maintainer: Qing Cai <br />

                   If you have questions, please contact me at <b>[tracestrack@icloud.com]</b>

                 </small>              </p>

              <h4>Privacy</h4>
              <p>
                We do not harvest or analyze user data in any way. Cookies is used only to save user preferences locally.
              </p>


              <h4>Other information</h4>
              <p><small>
                   Map refresh period: 1 to 7 days <br />
                   Please use a modern browser such as Chrome, Safari, Firefox, Edge, Opera <br />
                   Some tiles are generated on the fly, which could be slow <br />
                 </small>
              </p>
            </Modal.Body>
          </Modal>);
};

export default AboutPage;
