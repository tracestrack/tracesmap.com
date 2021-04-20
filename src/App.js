import { Button, Dropdown, DropdownButton, ButtonGroup, FormControl, InputGroup, Row, Container, Col } from 'react-bootstrap';

import './App.css';
import AboutPage from './AboutPage.js';
import {Fragment, Component} from "react";

const Nominatim = require('nominatim-geocoder');
const geocoder = new Nominatim({
  delay: 1000, // delay between requests
  secure: true, // enables ssl
  host:'nominatim.openstreetmap.org',
});

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
      showAbout: false,
      searchText: ""
    }
  }

  handleSearch = this.handleSearch.bind(this);
  handleSearch() {
    let searchValue = this.state.searchText

    let _t = this;
    geocoder.search( { q: searchValue } )
      .then((response) => {
        _t.setState({
          suggestions: response
        });

        let e = response[0];
        window.showSearchResult(e);
      })
      .catch((error) => {
        console.log(error)
      });

  };

  onKeyUp = this.onKeyUp.bind(this);
  onKeyUp(e) {
    if (e.charCode === 13) {
      this.handleSearch();
    }
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
        <Container>
          <Row>
            <Col sm={8}>



              <InputGroup className="search">
                <FormControl
                  placeholder="Search a place"
                  aria-describedby="basic-addon2"
                  value={this.state.searchText}
                  onChange={e => this.setState({ searchText: e.target.value }) }
                  onKeyPress={this.onKeyUp}
                />

                <Button variant="outline-secondary" onClick={this.handleSearch}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 18 18">
   <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
 </svg></Button>

              </InputGroup>

            </Col>
            <Col sm={4}>

              <InputGroup className="top_right">
                <ButtonGroup className="mr-2" aria-label="First group">
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

              <AboutPage show={this.state.showAbout} hide={this.handleShowAbout}/>
            </Col>
          </Row>

        </Container>
      </div>
    )};
}

export default App;
