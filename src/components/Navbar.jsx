import { Container, Nav, Navbar as BsNavbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice.js";
import { toggleTheme } from "../store/themeSlice.js";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const mode = useSelector((state) => state.theme.mode);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <BsNavbar bg="dark" data-bs-theme="dark" expand="lg" className="py-3">
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          Voyages
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="main-nav" />
        <BsNavbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={NavLink} to="/" end>
              Accueil
            </Nav.Link>
            <Nav.Link as={NavLink} to="/destinations">
              Destinations
            </Nav.Link>
            <Nav.Link as={NavLink} to="/search">
              Rechercher
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact">
              Contact
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              A propos
            </Nav.Link>
            {token ? (
              <>
                <Nav.Link as={NavLink} to="/profile">
                  Profil
                </Nav.Link>
                {user?.role === "admin" && (
                  <Nav.Link as={NavLink} to="/admin">
                    Administration
                  </Nav.Link>
                )}
                <Nav.Link as="button" onClick={handleLogout}>
                  Déconnexion
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">
                  Connexion
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register">
                  Inscription
                </Nav.Link>
              </>
            )}
            <Nav.Link
              as="button"
              onClick={() => dispatch(toggleTheme())}
              aria-label={mode === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
            >
              {mode === "dark" ? "☀️ Clair" : "🌙 Sombre"}
            </Nav.Link>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
