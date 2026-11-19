import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="py-5 text-center">
      <h1 className="display-3">404</h1>
      <p className="lead">Oups, cette page n'existe pas.</p>
      <Button as={Link} to="/" variant="primary" className="me-2">
        Retour à l'accueil
      </Button>
      <Button as={Link} to="/destinations" variant="outline-primary">
        Voir les destinations
      </Button>
    </div>
  );
}
