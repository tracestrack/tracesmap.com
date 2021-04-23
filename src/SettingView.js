import { Container, Row, Col, Modal, Tabs, Tab, ListGroup, Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from "react";

const server = [["Berlin", "a"],
               ["Los Angeles", "b"]];

const langs = [["Local", "_-name"],
               ["Arabic", "ar-name"],
               ["Dutch", "nl-name"],
               ["English", "en-name"],
               ["French", "fr-name"],
               ["German", "de-name"],
               ["Japanese", "ja-name"],
               ["Russian", "ru-name"],
               ["Simplified Chinese", "zh-hans-name"],
               ["Traditional Chinese", "zh-hant-name"]];

function SettingView({show, hide}) {

  const [lang, setLang] = useState(window.getCookie('lang'));
  const [retinaEnabled, setRetinaEnabled] = useState(window.getCookie('retina') == "true");

  const handleLanguage = function (e) {
    let t = e.target.textContent;
    let v = langs.filter(v => v[0] == t)[0][1]
    window.setLanguageLayer(v);
    setLang(_ => v);
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
    if (c == "a" || c == "b") {
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

              <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                <Tab eventKey="home" title="Language">
                  <ListGroup>

                    {langs.map(k => <ListGroup.Item size="sm" action key={k[1]} eventKey={k[1]} onClick={handleLanguage} active={k[1] == lang} >{k[0]}</ListGroup.Item>)}

                  </ListGroup>
                </Tab>
                <Tab eventKey="profile" title="Maps">
                  <br />

                  <Container>
                    <Row>
                      <Col sm={10}>Enable retina (4k) tiles <br /> (needs more graphic power)</Col>
                      <Col>                  <Form.Check
                                               type="switch"
                                               id="custom-switch"
                                               label=""
                                               checked={retinaEnabled}
                                               onChange={handleRetinaEnabled}
                                             /></Col>
                    </Row>
                    <Row>
                      <Col sm={7}>Tile Server</Col>
                      <Col>
                        <ToggleButtonGroup name="radio" defaultValue={getServer()} type="radio" className="mb-2" onChange={handleServerChange}>

                          {server.map(k => <ToggleButton key={k[1]} size="sm" type="radio" variant="light" value={k[1]}>{k[0]}</ToggleButton>)}

                        </ToggleButtonGroup>
                      </Col>

                    </Row>
                  </Container>

                </Tab>
              </Tabs>
            </Modal.Body>
          </Modal>);
};

export default SettingView;
