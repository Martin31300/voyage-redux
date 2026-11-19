import { useEffect, useState } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import Loader from "../../components/Loader.jsx";
import { deleteComment, fetchAllComments } from "../../store/commentsSlice.js";

export default function AdminCommentsPage() {
  const dispatch = useDispatch();
  const { all, allStatus, error } = useSelector((state) => state.comments);
  const [toDelete, setToDelete] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    dispatch(fetchAllComments());
  }, [dispatch]);

  const confirmDelete = async () => {
    const target = toDelete;
    setToDelete(null);
    setActionError("");
    try {
      await dispatch(deleteComment(target.id)).unwrap();
    } catch (message) {
      setActionError(typeof message === "string" ? message : "Erreur");
    }
  };

  return (
    <Loader status={allStatus} error={error}>
      {actionError && <Alert variant="danger">{actionError}</Alert>}
      {all.length === 0 ? (
        <Alert variant="light">Aucun commentaire.</Alert>
      ) : (
        <Table responsive hover className="align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Destination</th>
              <th>Auteur</th>
              <th>Note</th>
              <th>Commentaire</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {all.map((comment) => (
              <tr key={comment.id}>
                <td>{comment.id}</td>
                <td>{comment.destinationName || comment.destinationId}</td>
                <td>{comment.author || comment.userId}</td>
                <td>{comment.rating ?? "-"}</td>
                <td>{comment.content}</td>
                <td>{comment.createdAt}</td>
                <td className="text-end">
                  <Button size="sm" variant="outline-danger" onClick={() => setToDelete(comment)}>
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <ConfirmModal
        show={!!toDelete}
        title="Supprimer le commentaire"
        confirmLabel="Supprimer"
        onConfirm={confirmDelete}
        onHide={() => setToDelete(null)}
      >
        Supprimer ce commentaire ? Cette action est irréversible.
      </ConfirmModal>
    </Loader>
  );
}
