import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DestinationGrid from "../components/DestinationGrid.jsx";
import Loader from "../components/Loader.jsx";
import { fetchDestinations } from "../store/destinationsSlice.js";

export default function HomePage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.destinations);

  useEffect(() => {
    dispatch(fetchDestinations());
  }, [dispatch]);

  return (
    <>
      <div
        className="hero rounded-4 overflow-hidden mb-5"
        style={{
          backgroundImage:
            "url(https://cdn.pixabay.com/photo/2020/01/31/20/03/japan-4808857_1280.jpg)",
        }}
      >
        <div className="hero-overlay d-flex flex-column justify-content-center p-4 p-md-5">
          <h1 className="display-4 fw-bold">Voyages du Monde</h1>
          <p className="lead col-md-8">
            Découvrez des destinations inspirantes aux quatre coins de la planète : cultures,
            paysages et aventures vous attendent. Commentez, ajoutez vos favoris et partagez vos
            coups de coeur.
          </p>
          <div>
            <Button as={Link} to="/destinations" variant="primary" size="lg">
              Voir les destinations
            </Button>
          </div>
        </div>
      </div>

      <h2 className="mb-4">À découvrir</h2>
      <Loader status={status} error={error}>
        <DestinationGrid destinations={items.slice(0, 3)} />
      </Loader>
    </>
  );
}
