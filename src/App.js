import { Button, Dropdown, DropdownButton, ButtonGroup, FormControl, InputGroup } from 'react-bootstrap';

import './App.css';
import AboutPage from './AboutPage.js';
import {Fragment, Component} from "react";

const langs = [["Local", "_-name"],
               ["Arabian", "ar-name"],
               ["Dutch", "nl-name"],
               ["English", "en-name"],
               ["French", "fr-name"],
               ["German", "de-name"],
               ["Japanese", "ja-name"],
               ["Russian", "ru-name"],
               ["Simplified Chinese", "zh-hans-name"],
               ["Traditional Chinese", "zh-hant-name"]];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAbout: false
    }
  }

  handleSearch = this.handleSearch.bind(this);
  handleSearch() {

  };

  handleLanguage = this.handleLanguage.bind(this);
  handleLanguage(e) {
    let t = e.target.text;
    let v = langs.filter(v => v[0] == t)[0][1]
    window.setLanguageLayer(v);
  };

  handleShowAbout = this.handleShowAbout.bind(this);
  handleShowAbout() {
    this.setState({showAbout: !this.state.showAbout});
  };

  render() {
    return (
      <div>
        <InputGroup>
          <FormControl
            placeholder="Search a place"
            aria-describedby="basic-addon2"
          />

          <ButtonGroup className="mr-2" aria-label="First group">

            <Button variant="outline-secondary" onClick={this.handleSearch}>Search</Button>

            <DropdownButton
              as={ButtonGroup}
              key={1}
              title="Language"
            >
              {langs.map(k => <Dropdown.Item eventKey={k[1]} onClick={this.handleLanguage}>{k[0]}</Dropdown.Item>)}
            </DropdownButton>

            <Button variant="outline-secondary" onClick={this.handleShowAbout}>About</Button>
          </ButtonGroup>
        </InputGroup>

        {this.state.showAbout && <AboutPage/>}

      </div>
    )};
}

export default App;
