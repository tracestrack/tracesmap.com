import Button from 'react-bootstrap/Button'
import { InputGroup } from 'react-bootstrap';
import  FormControl  from 'react-bootstrap/FormControl';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Directions.css';

function doReset() {
  window.resetDirections();
}

function Directions({show, hide}) {

  return (<div className="directions">
            <InputGroup size="sm" className="directions_input">
              <InputGroup.Text id="inputGroup-sizing-sm">From</InputGroup.Text>
              <FormControl disabled id="dir_from" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
            </InputGroup>

            <InputGroup size="sm" className="directions_input">
              <InputGroup.Text id="inputGroup-sizing-sm">To</InputGroup.Text>
              <FormControl disabled id="dir_to" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
            </InputGroup>

            <div className="buttons">
              <Button variant="danger" size="sm" onClick={doReset}>Reset</Button>
            </div>

            <div id="directions_result"/>

          </div>);
};

export default Directions;
