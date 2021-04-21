import { Modal, Tabs, Tab, ListGroup, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from "react";

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

                    {langs.map(k => <ListGroup.Item action key={k[1]} eventKey={k[1]} onClick={handleLanguage} active={k[1] == lang} >{k[0]}</ListGroup.Item>)}

                  </ListGroup>
                </Tab>
                <Tab eventKey="profile" title="Maps">
                  <h2></h2>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Enable retina (4k) tiles (needs more graphic power)"
                    checked={retinaEnabled}
                    onChange={handleRetinaEnabled}
                  />

                </Tab>
              </Tabs>
            </Modal.Body>
          </Modal>);
};

export default SettingView;
