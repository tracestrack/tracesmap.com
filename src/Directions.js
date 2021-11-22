import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import { InputGroup } from 'react-bootstrap';
import  FormControl  from 'react-bootstrap/FormControl';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Directions.css';

function doReset() {
  window.resetDirections();
}

function Directions({show, hide}) {

  function useClickLocationAsFrom(f) {
    window.acceptingClick = "from";
  }

  function useClickLocationAsTo(f) {
    window.acceptingClick = "to";
  }

  function useCurrentLocationAsFrom(f) {
    window.useCurrentLocationAsFrom();
  }

  function useCurrentLocationAsTo(f) {
    window.useCurrentLocationAsTo();
  }

  function updateTransport(f) {
    window.updateTransport(f);
  }

  return (<div className="directions">
            <div className="directions_method">
              <ToggleButtonGroup type="radio" name="options" defaultValue={1}  onChange={updateTransport}>
                <ToggleButton id="tbg-radio-1" value="driving-car">
                  Driving
                </ToggleButton>
                <ToggleButton id="tbg-radio-2" value="cycling-regular">
                  Cycling
                </ToggleButton>
                <ToggleButton id="tbg-radio-3" value="cycling-mountain">
                  Cycling MTB
                </ToggleButton>
                <ToggleButton id="tbg-radio-4" value="foot-walking">
                  Walking
                </ToggleButton>
                <ToggleButton id="tbg-radio-5" value="foot-hiking">
                  Hiking
                </ToggleButton>
              </ToggleButtonGroup>

            </div>

            <InputGroup size="sm" className="directions_input">

              <DropdownButton
                variant="outline-secondary"
                title="From"
                size="sm"
                id="input-group-dropdown-1"
              >
                <Dropdown.Item onClick={useClickLocationAsFrom}>Click on map</Dropdown.Item>
                <Dropdown.Item onClick={useCurrentLocationAsFrom}>Use current location</Dropdown.Item>
              </DropdownButton>

              <FormControl onClick={useClickLocationAsFrom} id="dir_from" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
            </InputGroup>

            <InputGroup size="sm" className="directions_input">
              <DropdownButton
                variant="outline-secondary"
                title="To"
                size="sm"
                id="input-group-dropdown-1"
              >
                <Dropdown.Item onClick={useClickLocationAsTo}>Click on map</Dropdown.Item>
                <Dropdown.Item onClick={useCurrentLocationAsTo}>Use current location</Dropdown.Item>
              </DropdownButton>
              <FormControl onClick={useClickLocationAsTo} id="dir_to" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
            </InputGroup>

            <div className="buttons">
              <Button variant="danger" size="sm" onClick={doReset}>Reset</Button>
            </div>

            <div id="directions_result"/>

          </div>);
};

export default Directions;
