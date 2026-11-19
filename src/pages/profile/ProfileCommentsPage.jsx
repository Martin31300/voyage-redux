import { useEffect } from "react";
import { Alert, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader.jsx";
import { fetchMyComments } from "../../store/commentsSlice.js";
import { fetchDestinations } from "../../store/destinationsSlice.js";

export default function ProfileCommentsPage() {
  const dispatch = useDispatch();
  const { mine, mineStatus, error } = useSelector((state) => state.comments);
  const destinations = useSelector((state) => state.destinations.items);

  useEffect(() => {
    dispatch(fetchMyComments());
    dispatch(fetchDestinations());
  }, [dispatch]);

  return (
    <Loader status={mineStatus} error={error}>
      {mine.length === 0 ? (
        <Alert variant="light">Vous n'avez pas encore commenté de destination.</Alert>
      ) : (
        mine.map((comment) => {
          const destination = destinations.find((d) => String(d.id) === String(comment.destinationId));
          return (
            <Card key={comment.id} className="mb-3 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <strong>
                    {comment.destinationSlug ? (
                      <Link to={`/destinations/${comment.destinationSlug}`}>
                        {comment.destinationName}
                      </Link>
                    ) : (
                      comment.destinationName || destination?.name || `Destination ${comment.destinationId}`
                    )}
                  </strong>
                  {comment.rating ? (
                    <span className="text-warning">
                      {"★".repeat(comment.rating)}
                      {"☆".repeat(5 - comment.rating)}
                    </span>
                  ) : null}
                </div>
                <div className="text-muted small mb-2">{comment.createdAt}</div>
                <div>{comment.content}</div>
              </Card.Body>
            </Card>
          );
        })
      )}
    </Loader>
  );
}
