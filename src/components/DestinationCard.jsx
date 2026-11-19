import { Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DestinationCard({ destination }) {
  return (
    <Card className="h-100 shadow-sm border-0 destination-card">
      <Card.Img variant="top" src={destination.image} alt={destination.name} />
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="primary">{destination.regionName}</Badge>
        </div>
        <Card.Title>{destination.name}</Card.Title>
        <Card.Text className="text-muted">
          <span className="fw-bold">Capitale :</span> {destination.capital}
        </Card.Text>
        <Button
          as={Link}
          to={`/destinations/${destination.slug}`}
          variant="outline-primary"
          className="mt-auto"
        >
          Voir le détail
        </Button>
      </Card.Body>
    </Card>
  );
}
