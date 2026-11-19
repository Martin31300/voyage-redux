import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { fetchRegions } from "../store/destinationsSlice.js";
import { fetchFavorites } from "../store/favoritesSlice.js";

export default function MainLayout() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", mode);
  }, [mode]);

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  useEffect(() => {
    if (token) dispatch(fetchFavorites());
  }, [dispatch, token]);

  return (
    <>
      <Navbar />
      <Container className="py-4 page-container">
        <Outlet />
      </Container>
    </>
  );
}
