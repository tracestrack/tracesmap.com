import { Container, Row, Col, Modal, Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from "react";

const server = [["Berlin", "a"],
                ["Los Angeles", "b"]];

const langs = [["Local *", "_-name"],
               ["Arabic", "ar-name"],
               ["Brazilian Portuguese", "br-name"],
               ["Dutch", "nl-name"],
               ["English *", "en-name"],
               ["Finnish", "fi-name"],
               ["French *", "fr-name"],
               ["German", "de-name"],
               ["Hebrew", "he-name"],
               ["Hungarian", "hu-name"],
               ["Italian", "it-name"],
               ["Korean", "ko-name"],
               ["Polish", "pl-name"],
               ["Portuguese", "pt-name"],
               ["Japanese", "ja-name"],
               ["Russian", "ru-name"],
               ["Simplified Chinese *", "zh-hans-name"],
               ["Spanish", "es-name"],
               ["Traditional Chinese", "zh-hant-name"],
              ];

function SettingView({show, hide}) {

  const [lang, setLang] = useState(window.getCookie('lang'));
  const [retinaEnabled, setRetinaEnabled] = useState(window.getCookie('retina') !== "false");

  const handleLanguage = function (e) {
    let t = e.target.value;
    window.setLanguageLayer(t);
    setLang(_ => t);
  };

  const handleRetinaEnabled = function(e) {
    window.setRetinaEnabled(e.target.checked);
    setRetinaEnabled(v => !v);
  }

  const handleServerChange = function(e) {
    window.setServer(e);
  }

  const getServer = function() {
    let c = window.getCookie("server");
    if (c === "a" || c === "b") {
      return c;
    }
    return "a";
  }

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

                <Row>
                  <Col>Language
                  </Col>
                  <Col>                 <Form.Group>

                                           <Form.Control as="select" onChange={handleLanguage} >
                                             {langs.map(k => <option action key={k[1]} value={k[1]} selected={k[1] === lang} >{k[0]}</option>)}
                                           </Form.Control>

                                         </Form.Group></Col>

                </Row>


                <Row>
                  <Col sm={10}>High Resolution Tiles</Col>
                  <Col>                  <Form.Check
                  type="switch"
                  id="custom-switch"
                  label=""
                  checked={retinaEnabled}
                  onChange={handleRetinaEnabled}  /></Col>
                </Row>


                    <Form.Text className="text-muted" size="sm">
                      Languages with <b>*</b> has full zoom levels, otherwise up to 9.
                    </Form.Text>

              </Container>

            </Modal.Body>
          </Modal>);
};

export default SettingView;
