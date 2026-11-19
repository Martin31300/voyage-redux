import { Nav } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <section>
      <h1 className="mb-4">Administration</h1>
      <Nav variant="pills" className="mb-4 gap-2">
        <Nav.Link as={NavLink} to="/admin/contacts">
          Contacts
        </Nav.Link>
        <Nav.Link as={NavLink} to="/admin/users">
          Utilisateurs
        </Nav.Link>
        <Nav.Link as={NavLink} to="/admin/destinations">
          Destinations
        </Nav.Link>
        <Nav.Link as={NavLink} to="/admin/comments">
          Commentaires
        </Nav.Link>
      </Nav>
      <Outlet />
    </section>
  );
}
