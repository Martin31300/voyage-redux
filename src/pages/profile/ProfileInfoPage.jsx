import { useState } from "react";
import { Alert, Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import PasswordModal from "../../components/PasswordModal.jsx";
import ProfileEditModal from "../../components/ProfileEditModal.jsx";
import { changePassword } from "../../store/usersSlice.js";

export default function ProfileInfoPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user) || {};
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  const submitPassword = async (values) => {
    await dispatch(changePassword(values)).unwrap().catch((message) => {
      throw new Error(message);
    });
    setNotice("Mot de passe modifié.");
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        {notice && (
          <Alert variant="success" dismissible onClose={() => setNotice("")}>
            {notice}
          </Alert>
        )}
        <ListGroup variant="flush" className="mb-3">
          <ListGroup.Item><strong>Nom d'utilisateur :</strong> {user.username}</ListGroup.Item>
          <ListGroup.Item><strong>Email :</strong> {user.email}</ListGroup.Item>
          <ListGroup.Item><strong>Prénom :</strong> {user.firstName}</ListGroup.Item>
          <ListGroup.Item><strong>Nom :</strong> {user.lastName}</ListGroup.Item>
          <ListGroup.Item><strong>Genre :</strong> {user.gender || "Non précisé"}</ListGroup.Item>
          <ListGroup.Item><strong>Rôle :</strong> {user.role}</ListGroup.Item>
          {user.createdAt && (
            <ListGroup.Item><strong>Inscrit le :</strong> {user.createdAt}</ListGroup.Item>
          )}
        </ListGroup>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={() => setShowEdit(true)}>
            Modifier mes informations
          </Button>
          <Button variant="outline-secondary" onClick={() => setShowPassword(true)}>
            Changer mon mot de passe
          </Button>
        </div>
      </Card.Body>

      {showEdit && <ProfileEditModal show={showEdit} onHide={() => setShowEdit(false)} user={user} />}
      <PasswordModal
        show={showPassword}
        onHide={() => setShowPassword(false)}
        title="Changer mon mot de passe"
        requireCurrent
        onSubmit={submitPassword}
      />
    </Card>
  );
}
