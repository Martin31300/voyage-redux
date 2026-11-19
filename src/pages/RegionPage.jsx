import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import DestinationGrid from "../components/DestinationGrid.jsx";
import Loader from "../components/Loader.jsx";
import { fetchDestinationsByRegion } from "../store/destinationsSlice.js";

export default function RegionPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { regionItems, regionStatus, regions, error } = useSelector((state) => state.destinations);
  const region = regions.find((r) => r.slug === slug);

  useEffect(() => {
    dispatch(fetchDestinationsByRegion(slug));
  }, [dispatch, slug]);

  return (
    <section>
      <h1 className="mb-4">Région : {region?.name || slug}</h1>
      <Loader status={regionStatus} error={error}>
        <DestinationGrid
          destinations={regionItems}
          emptyMessage="Aucune destination pour cette région"
        />
      </Loader>
      <Button as={Link} to="/destinations" variant="secondary" className="mt-4">
        Retour aux destinations
      </Button>
    </section>
  );
}
