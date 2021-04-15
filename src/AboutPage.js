import { Card } from 'react-bootstrap';
import './AboutPage.css';

function AboutPage({}) {
  return (<Card className="about text-center">
            <Card.Header>About</Card.Header>
            <Card.Body>
              <Card.Title>Map Information</Card.Title>
              <Card.Text>
                Map data: © OpenStreetMap contributors
              </Card.Text>
              <Card.Text>
                Map style: Carto (https://github.com/gravitystorm/openstreetmap-carto)
              </Card.Text>
              <Card.Text>
                Brought to you with ❤️ by Qing Cai
              </Card.Text>
              <Card.Text>
                Map refresh period: 3 to 7 days
              </Card.Text>
            </Card.Body>
          </Card>);
}

export default AboutPage;
