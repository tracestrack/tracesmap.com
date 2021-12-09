import { ButtonGroup, ListGroup, Container, Row, Col, Modal, Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from "react";

const server = [["Berlin", "a"],
                ["Los Angeles", "b"]];

const langs = [["Global *", "_-name"],
               ["عربي", "ar-name"],
               ["Breton", "br-name"],
               ["Deutsch", "de-name"],
               ["English *", "en-name"],
               ["español", "es-name"],
               ["suomen kieli", "fi-name"],
               ["français", "fr-name"],
               ["magyar nyelv", "hu-name"],
               ["עִבְרִית‎", "he-name"],
               ["italiano", "it-name"],
               ["日本語", "ja-name"],
               ["한국어", "ko-name"],
               ["Nederlands", "nl-name"],
               ["polski", "pl-name"],
               ["português", "pt-name"],
               ["русский", "ru-name"],
               ["简体中文", "zh-hans-name"],
               ["繁體中文", "zh-hant-name"],
              ];

function SettingView({show, hide}) {

  const [lang, setLang] = useState(window.getCookie('lang'));

  const handleLanguage = function (e) {
    let t = e.target.innerText;

    var v = langs.filter(k => k[0] == t)[0][1];

    window.setLanguageLayer(v);
    setLang(_ => v);
  };

  const [value, setValue] = useState(window.getCookie('auto-refresh') == "true");

  const handleChange = function(e) {
    window.setCookie('auto-refresh', e.target.checked, 1000);
    setValue(v => !v);
  };

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

              <h5>Options</h5>
              <p>
                <Form>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Auto refresh"
                    checked={value}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Refresh maps 10 seconds after moving to a new region
                  </Form.Text>
                </Form>
              </p>

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
