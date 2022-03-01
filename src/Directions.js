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
              <ToggleButtonGroup type="radio" name="options" defaultValue="driving-car" onChange={updateTransport} size="sm">
                <ToggleButton id="tbg-radio-1" value="driving-car">
                  {window.l("Driving")}
                </ToggleButton>
                <ToggleButton id="tbg-radio-2" value="cycling-regular">
                  {window.l("Cycling")}
                </ToggleButton>
                <ToggleButton id="tbg-radio-3" value="cycling-mountain">
                  {window.l("Cycling MTB")}
                </ToggleButton>
                <ToggleButton id="tbg-radio-4" value="foot-walking">
                  {window.l("Walking")}
                </ToggleButton>
                <ToggleButton id="tbg-radio-5" value="foot-hiking">
                  {window.l("Hiking")}
                </ToggleButton>
              </ToggleButtonGroup>

            </div>

            <InputGroup size="sm" className="directions_input">

              <DropdownButton
                variant="outline-secondary"
                title={window.l("From")}
                size="sm"
                id="input-group-dropdown-1"
              >
                <Dropdown.Item onClick={useClickLocationAsFrom}>{window.l("Click on map")}</Dropdown.Item>
                <Dropdown.Item onClick={useCurrentLocationAsFrom}>{window.l("Use current location")}</Dropdown.Item>
              </DropdownButton>

              <FormControl onClick={useClickLocationAsFrom} id="dir_from" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
            </InputGroup>

            <InputGroup size="sm" className="directions_input">
              <DropdownButton
                variant="outline-secondary"
                title={window.l("To")}
                size="sm"
                id="input-group-dropdown-1"
              >
                <Dropdown.Item onClick={useClickLocationAsTo}>{window.l("Click on map")}</Dropdown.Item>
                <Dropdown.Item onClick={useCurrentLocationAsTo}>{window.l("Use current location")}</Dropdown.Item>
              </DropdownButton>
              <FormControl onClick={useClickLocationAsTo} id="dir_to" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
            </InputGroup>

            <div className="buttons">
              <Button variant="danger" size="sm" onClick={doReset}>{window.l("Reset")}</Button>
            </div>

            <div id="directions_result"/>

          </div>);
};

export default Directions;
