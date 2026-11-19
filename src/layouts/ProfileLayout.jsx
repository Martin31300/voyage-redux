import { Badge, Card, Image, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

export default function ProfileLayout() {
  const user = useSelector((state) => state.auth.user) || {};
  return (
    <section>
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body className="d-flex align-items-center gap-3">
          <Image src={user.avatar} alt={user.username} roundedCircle width={80} height={80} />
          <div>
            <h1 className="h4 mb-1">
              {user.firstName} {user.lastName}
            </h1>
            <div className="text-muted">@{user.username}</div>
            {user.role && <Badge bg={user.role === "admin" ? "danger" : "secondary"}>{user.role}</Badge>}
          </div>
        </Card.Body>
      </Card>
      <Nav variant="tabs" className="mb-4">
        <Nav.Link as={NavLink} to="/profile" end>
          Informations
        </Nav.Link>
        <Nav.Link as={NavLink} to="/profile/favorites">
          Favoris
        </Nav.Link>
        <Nav.Link as={NavLink} to="/profile/comments">
          Commentaires
        </Nav.Link>
      </Nav>
      <Outlet />
    </section>
  );
}
