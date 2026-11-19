import { Alert, Col, Row } from "react-bootstrap";
import DestinationCard from "./DestinationCard.jsx";

export default function DestinationGrid({ destinations, emptyMessage = "Aucune destination" }) {
  if (destinations.length === 0) {
    return <Alert variant="light">{emptyMessage}</Alert>;
  }
  return (
    <Row className="g-4">
      {destinations.map((destination) => (
        <Col md={6} lg={4} key={destination.id}>
          <DestinationCard destination={destination} />
        </Col>
      ))}
    </Row>
  );
}
