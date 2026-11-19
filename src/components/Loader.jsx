import { Alert, Spinner } from "react-bootstrap";

export default function Loader({ status, error, children }) {
  if (status === "loading") {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }
  if (status === "failed") {
    return <Alert variant="danger">{error || "Une erreur est survenue"}</Alert>;
  }
  return children;
}
