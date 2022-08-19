import { ListGroup, Container, Modal, Form } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from "react";

const ui_langs = [["Dutch / Nederlands", "nl-NL"],
                  ["English", "en-US"],
                  ["French / Français", "fr-FR"],
                  ["Simplified Chinese / 简体中文", "zh-CN"]
                 ];

const langs = [
  [window.l("Auto"), "auto-name"],
  [window.l("Global *"), "_-name"],
  ["عربي", "ar-name"],
  ["Deutsch", "de-name"],
  ["English *", "en-name"],
  ["español", "es-name"],
  ["suomen kieli", "fi-name"],
  ["Français", "fr-name"],
  ["magyar nyelv", "hu-name"],
  ["עִבְרִית‎", "he-name"],
  ["italiano", "it-name"],
  ["日本語", "ja-name"],
  ["한국어", "ko-name"],
  ["Nederlands", "nl-name"],
  ["український", "uk-name"],
  ["polski", "pl-name"],
  ["português", "pt-name"],
  ["русский", "ru-name"],
  ["简体中文", "zh-hans-name"],
  ["繁體中文", "zh-hant-name"],
];

function SettingView({show, hide}) {

  const [lang, setLang] = useState(window.getCookie('lang'));
  const [ui_lang, setUILang] = useState(window.getCookie('ui_lang'));

  const handleLanguage = function (e) {
    let t = e.target.innerText;

    var v = langs.filter(k => k[0] === t)[0][1];

    window.setLanguageLayer(v);
    setLang(_ => v);
  };

  const handleUILanguage = function (e) {
    let t = e.target.value;
    var v = ui_langs.filter(k => k[1] === t)[0][1];
    window.setupI18N(v);
    setUILang(_ => v);
  };

  return (<Modal
              show={show}
              onHide={hide}
              dialogClassName="modal-90w"
              aria-labelledby="example-custom-modal-styling-title"
          >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              {window.l('Settings')}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Container>
              <h5>{window.l('Interface Languages')}</h5>

              <Form>
                <Form.Group controlId="exampleForm.SelectCustom">
                  <Form.Control as="select" custom onChange={handleUILanguage}>
                    {
                      ui_langs.map(k => <option key={k[1]} selected={k[1] === ui_lang} value={k[1]}>
                                          {k[0]}
                                        </option>)
                    }
                  </Form.Control>
                </Form.Group>
              </Form>

              <h5>{window.l('Languages')}</h5>

              <div>
                <Form.Text className="text-muted" size="sm">
                  {window.l('Languages with <b>*</b> has full zoom levels.')}
                </Form.Text>

                <ListGroup>
                  {langs.map(k => <ListGroup.Item key={k[1]} as="button" active={k[1] === lang} action onClick={handleLanguage}>
                          {k[0]}
                        </ListGroup.Item>)}
                </ListGroup>
              </div>
            </Container>

          </Modal.Body>
        </Modal>);
};

export default SettingView;
