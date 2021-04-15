import { Button, Dropdown, DropdownButton, ButtonGroup, FormControl, InputGroup } from 'react-bootstrap';

import logo from './logo.svg';
import './App.css';

function App() {

  const handleSearch = () => {
    window.addLayer("fr-name");
  };

  const handleLanguage = (e) => {
    let t = e.target.text;
    let v = langs.filter(v => v[0] == t)[0][1]
    window.setLanguageLayer(v);
  };

  const langs = [["Local", "_-name"],
                 ["Arabian", "ar-name"],
                 ["Dutch", "nl-name"],
                 ["English", "en-name"],
                 ["French", "fr-name"],
                 ["German", "de-name"],
                 ["Russian", "ru-name"],
                 ["Simplified Chinese", "zh-hans-name"],
                 ["Traditional Chinese", "zh-hant-name"]];

  return (
    <div>
      <InputGroup>
        <FormControl
          placeholder="Search a place"
          aria-describedby="basic-addon2"
        />

        <ButtonGroup className="mr-2" aria-label="First group">

          <Button variant="outline-secondary" onClick={handleSearch}>Search</Button>

          <DropdownButton
            as={ButtonGroup}
            key={1}
            title="Language"
          >

            {langs.map(k => <Dropdown.Item eventKey={k[1]} onClick={handleLanguage}>{k[0]}</Dropdown.Item>)}

          </DropdownButton>

          <Button variant="outline-secondary">About</Button>
          <Button variant="outline-secondary">Donate</Button>
        </ButtonGroup>
      </InputGroup>



    </div>
  );
}

export default App;
