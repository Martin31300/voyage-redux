import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import Loader from "../../components/Loader.jsx";
import { fetchDestinations } from "../../store/destinationsSlice.js";
import { fetchFavorites, removeFavorite } from "../../store/favoritesSlice.js";

export default function ProfileFavoritesPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.favorites);
  const destinations = useSelector((state) => state.destinations.items);
  const [toRemove, setToRemove] = useState(null);

  useEffect(() => {
    dispatch(fetchFavorites());
    dispatch(fetchDestinations());
  }, [dispatch]);

  const confirmRemove = async () => {
    await dispatch(removeFavorite(toRemove.destinationId));
    setToRemove(null);
  };

  return (
    <Loader status={status} error={error}>
      {items.length === 0 ? (
        <Alert variant="light">
          Vous n'avez pas encore de favoris. <Link to="/destinations">Parcourir les destinations</Link>
        </Alert>
      ) : (
        <Row className="g-4">
          {items.map((favorite) => {
            const destination = destinations.find((d) => String(d.id) === String(favorite.destinationId));
            return (
              <Col md={6} lg={4} key={favorite.id ?? favorite.destinationId}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Img variant="top" src={favorite.image || destination?.image} alt={favorite.title} />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{favorite.title || destination?.name}</Card.Title>
                    <div className="mt-auto d-flex gap-2">
                      {destination && (
                        <Button as={Link} to={`/destinations/${destination.slug}`} variant="outline-primary">
                          Voir le détail
                        </Button>
                      )}
                      <Button variant="outline-danger" onClick={() => setToRemove(favorite)}>
                        Retirer
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
      <ConfirmModal
        show={!!toRemove}
        title="Retirer des favoris"
        confirmLabel="Retirer"
        onConfirm={confirmRemove}
        onHide={() => setToRemove(null)}
      >
        Retirer {toRemove?.title} de vos favoris ?
      </ConfirmModal>
    </Loader>
  );
}
