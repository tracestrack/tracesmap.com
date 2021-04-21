import { Button, Dropdown, DropdownButton, ButtonGroup, FormControl, InputGroup, Row, Container, Col } from 'react-bootstrap';

import './App.css';
import AboutPage from './AboutPage.js';
import SettingView from './SettingView.js';
import {Fragment, Component} from "react";

const Nominatim = require('nominatim-geocoder');
const geocoder = new Nominatim({
  delay: 1000, // delay between requests
  secure: true, // enables ssl
  host:'nominatim.openstreetmap.org',
}, {
  limit: 10,
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAbout: false,
      showSetting: false,
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

        window.showSearchResult(response);
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

  handleShowAbout = this.handleShowAbout.bind(this);
  handleShowAbout() {
    this.setState({showAbout: !this.state.showAbout});
  };

  handleShowSetting = this.handleShowSetting.bind(this);
  handleShowSetting() {
    this.setState({showSetting: !this.state.showSetting});
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

                <Button variant="outline-secondary" onClick={this.handleSearch}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 18 18">
   <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
 </svg></Button>

              </InputGroup>

            </Col>
            <Col sm={4}>

              <InputGroup className="top_right">
                <ButtonGroup className="mr-2" aria-label="First group">


                  <Button variant="outline-secondary" onClick={this.handleShowSetting}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                                         <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z"/>
                                                                                       </svg></Button>
                  <Button variant="outline-secondary" onClick={this.handleShowAbout}>About</Button>
                </ButtonGroup>
              </InputGroup>

              <AboutPage show={this.state.showAbout} hide={this.handleShowAbout}/>
              <SettingView show={this.state.showSetting} hide={this.handleShowSetting}/>
            </Col>
          </Row>

        </Container>
      </div>
    )};
}

export default App;
