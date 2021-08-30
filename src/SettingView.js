import { ListGroup, Container, Row, Col, Modal, Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from "react";

const server = [["Berlin", "a"],
                ["Los Angeles", "b"]];

const langs = [["Local *", "_-name"],
               ["Arabic", "ar-name"],
               ["Breton", "br-name"],
               ["Dutch", "nl-name"],
               ["English *", "en-name"],
               ["Finnish", "fi-name"],
               ["French", "fr-name"],
               ["German", "de-name"],
               ["Hebrew", "he-name"],
               ["Hungarian", "hu-name"],
               ["Italian", "it-name"],
               ["Korean", "ko-name"],
               ["Polish", "pl-name"],
               ["Portuguese", "pt-name"],
               ["Japanese", "ja-name"],
               ["Russian", "ru-name"],
               ["Simplified Chinese", "zh-hans-name"],
               ["Spanish", "es-name"],
               ["Traditional Chinese", "zh-hant-name"],
              ];

function SettingView({show, hide}) {

  const [lang, setLang] = useState(window.getCookie('lang'));
  //const [retinaEnabled, setRetinaEnabled] = useState(window.getCookie('retina') !== "false");

  const handleLanguage = function (e) {
    let t = e.target.innerText;

    var v = langs.filter(k => k[0] == t)[0][1];

    window.setLanguageLayer(v);
    setLang(_ => v);
  };

  /*const handleRetinaEnabled = function(e) {
    window.setRetinaEnabled(e.target.checked);
    setRetinaEnabled(v => !v);
    }*/

  return (<Modal
              show={show}
              onHide={hide}
              dialogClassName="modal-90w"
              aria-labelledby="example-custom-modal-styling-title"
          >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Settings
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Container>
              <h5>Languages</h5>

              <div>
                <Form.Text className="text-muted" size="sm">
                  Languages with <b>*</b> has full zoom levels.
                </Form.Text>

                <ListGroup>
                  {langs.map(k => <ListGroup.Item as="button" active={k[1] === lang} action onClick={handleLanguage}>
                          {k[0]}
                        </ListGroup.Item>)}
                </ListGroup>
              </div>
            </Container>

          </Modal.Body>
        </Modal>);
};

export default SettingView;
