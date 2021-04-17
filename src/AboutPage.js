import { Modal, Card } from 'react-bootstrap';
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
              <p>
                Map data: © OpenStreetMap contributors <br />

                Map style: Carto (https://github.com/gravitystorm/openstreetmap-carto) <br />

                Brought to you with ❤️ by Qing Cai <br />

                Map refresh period: 3 to 7 days

              </p>
            </Modal.Body>
          </Modal>);
};

export default AboutPage;
