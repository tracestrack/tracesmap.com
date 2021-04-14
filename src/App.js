import { Button, Dropdown, DropdownButton, ButtonGroup, FormControl, InputGroup } from 'react-bootstrap';

import logo from './logo.svg';
import './App.css';

function App() {

  const handleClick = () => {
    window.addLayer("fr-name");
  };

  return (
    <div>
      <InputGroup>
        <FormControl
          placeholder="Search a place"
          aria-describedby="basic-addon2"
        />

        <ButtonGroup className="mr-2" aria-label="First group">

          <Button variant="outline-secondary" onClick={handleClick}>Search</Button>

          <DropdownButton
            as={ButtonGroup}
            key={1}
            title="Language"
          >
            <Dropdown.Item eventKey="1">Action</Dropdown.Item>
            <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
            <Dropdown.Item eventKey="3" active>
              Active Item
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
          </DropdownButton>

          <Button variant="outline-secondary">About</Button>
          <Button variant="outline-secondary">Donate</Button>
        </ButtonGroup>
      </InputGroup>



    </div>
  );
}

export default App;
