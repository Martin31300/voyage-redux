import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DestinationGrid from "../components/DestinationGrid.jsx";
import Loader from "../components/Loader.jsx";
import { fetchDestinations } from "../store/destinationsSlice.js";

export default function DestinationsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.destinations);

  useEffect(() => {
    dispatch(fetchDestinations());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-center">Destinations</h1>
      <hr />
      <p className="text-center text-muted small mb-4">Choisissez une destination</p>
      <Loader status={status} error={error}>
        <DestinationGrid destinations={items} />
      </Loader>
    </div>
  );
}
