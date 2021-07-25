import { Button, InputGroup} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import ToggleButton from 'react-bootstrap/ToggleButton';

import Suggest from './Suggest';
import './App.css';
import AboutPage from './AboutPage.js';
import Directions from './Directions.js';
import SettingView from './SettingView.js';
import {Component} from "react";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAbout: false,
      showSetting: false,
      showDirections: false
    }
  }

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

  handleShowDirections = this.handleShowDirections.bind(this);
  handleShowDirections() {
    this.setState({showDirections: !this.state.showDirections});
  };

  render() {
    return (
      <div className="top">
        <InputGroup>

          <Button id="dir" key="Xxx" type="checkbox" variant="primary" checked={this.state.showDirections} variant="outline-secondary" onClick={this.handleShowDirections}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 7.27l4.28 10.43-3.47-1.53-.81-.36-.81.36-3.47 1.53L12 7.27M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
          </Button>

          <Suggest/>

          <Button variant="outline-secondary" onClick={this.handleShowSetting}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                                 <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z"/>
                                                                               </svg>
          </Button>
          <Button variant="outline-secondary" onClick={this.handleShowAbout}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                                                                                       <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                                                                       <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                                                                     </svg></Button>


          <AboutPage show={this.state.showAbout} hide={this.handleShowAbout}/>
          <SettingView show={this.state.showSetting} hide={this.handleShowSetting}/>

        </InputGroup>

        {this.state.showDirections && (<Directions/>)}

      </div>
    )}
}

export default App;
