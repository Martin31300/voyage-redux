import { useEffect, useState } from "react";
import { Alert, Badge, Button, Image, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader.jsx";
import PasswordModal from "../../components/PasswordModal.jsx";
import { adminChangePassword, fetchUsers } from "../../store/usersSlice.js";

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.users);
  const [target, setTarget] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const submit = async (values) => {
    try {
      await dispatch(
        adminChangePassword({
          user_id: target.id,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }),
      ).unwrap();
    } catch (message) {
      throw new Error(typeof message === "string" ? message : "Erreur");
    }
    setNotice(`Mot de passe de ${target.username} modifié.`);
  };

  return (
    <Loader status={status} error={error}>
      {notice && (
        <Alert variant="success" dismissible onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}
      <Table responsive hover className="align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>Utilisateur</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <Image src={user.avatar} alt="" roundedCircle width={36} height={36} />
              </td>
              <td>{user.username}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.role === "admin" ? "danger" : "secondary"}>{user.role}</Badge>
              </td>
              <td className="text-end">
                <Button size="sm" variant="outline-secondary" onClick={() => setTarget(user)}>
                  Modifier le mot de passe
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <PasswordModal
        show={!!target}
        onHide={() => setTarget(null)}
        title={`Mot de passe de ${target?.username ?? ""}`}
        requireCurrent={false}
        onSubmit={submit}
      />
    </Loader>
  );
}
