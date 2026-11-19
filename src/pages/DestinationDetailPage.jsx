import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import * as yup from "yup";
import ConfirmModal from "../components/ConfirmModal.jsx";
import DestinationMap from "../components/DestinationMap.jsx";
import FormField from "../components/FormField.jsx";
import Loader from "../components/Loader.jsx";
import { createComment, fetchCommentsByDestination } from "../store/commentsSlice.js";
import { fetchDestination } from "../store/destinationsSlice.js";
import { addFavorite, removeFavorite } from "../store/favoritesSlice.js";
import NotFoundPage from "./NotFoundPage.jsx";

const ratingOptions = [
  { value: "", label: "Sans note" },
  ...[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n} / 5` })),
];

const commentSchema = yup.object({
  content: yup.string().trim().required("Le commentaire est obligatoire"),
  rating: yup.string(),
});

function CommentForm({ destinationId }) {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(commentSchema),
    defaultValues: { content: "", rating: "" },
  });

  const onSubmit = async (data) => {
    setError("");
    const body = { destination_id: destinationId, content: data.content };
    if (data.rating) body.rating = Number(data.rating);
    try {
      await dispatch(createComment(body)).unwrap();
      reset();
    } catch (message) {
      setError(typeof message === "string" ? message : "Erreur");
    }
  };

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Votre commentaire" name="content" as="textarea" rows={3} register={register} errors={errors} />
          <FormField label="Note" name="rating" options={ratingOptions} register={register} errors={errors} />
          <Button type="submit" variant="outline-primary" disabled={isSubmitting}>
            Publier
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default function DestinationDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [showFavModal, setShowFavModal] = useState(false);
  const { current, currentStatus, error } = useSelector((state) => state.destinations);
  const token = useSelector((state) => state.auth.token);
  const favorites = useSelector((state) => state.favorites.items);
  const comments = useSelector((state) => state.comments);

  useEffect(() => {
    dispatch(fetchDestination(slug));
  }, [dispatch, slug]);

  const destinationId = current?.slug === slug ? current.id : null;

  useEffect(() => {
    if (destinationId) dispatch(fetchCommentsByDestination(destinationId));
  }, [dispatch, destinationId]);

  if (currentStatus === "failed") return <NotFoundPage />;

  const destination = current?.slug === slug ? current : null;
  const isFavorite =
    destination && favorites.some((f) => String(f.destinationId) === String(destination.id));

  const confirmFavorite = async () => {
    setShowFavModal(false);
    if (isFavorite) {
      await dispatch(removeFavorite(destination.id));
    } else {
      await dispatch(addFavorite(destination));
    }
  };

  return (
    <Loader status={destination ? "succeeded" : currentStatus} error={error}>
      {destination && (
        <article>
          <Row className="g-4 mb-4">
            <Col md={6}>
              <Image src={destination.image} alt={destination.name} fluid rounded />
            </Col>
            <Col md={6}>
              <h1>{destination.name}</h1>
              <p className="mb-2">
                <Badge bg="primary" as={Link} to={`/region/${destination.regionSlug}`} className="text-decoration-none">
                  {destination.regionName}
                </Badge>
              </p>
              <p className="text-muted">
                <strong>Capitale :</strong> {destination.capital}
              </p>
              <p>{destination.description}</p>
              {token ? (
                <Button
                  variant={isFavorite ? "danger" : "outline-danger"}
                  onClick={() => setShowFavModal(true)}
                >
                  {isFavorite ? "♥ Retirer des favoris" : "♡ Ajouter aux favoris"}
                </Button>
              ) : (
                <>
                  <Button variant="outline-danger" disabled>
                    ♡ Ajouter aux favoris
                  </Button>
                  <p className="text-muted small mt-2 mb-0">
                    <Link to="/login">Connectez-vous</Link> pour ajouter cette destination à vos favoris.
                  </p>
                </>
              )}
            </Col>
          </Row>

          <DestinationMap lat={destination.lat} long={destination.long} name={destination.name} />

          <h2 className="h4 mt-5 mb-3">Commentaires</h2>
          {token ? (
            <CommentForm destinationId={destination.id} />
          ) : (
            <Alert variant="light">
              <Link to="/login">Connectez-vous</Link> pour laisser un commentaire.
            </Alert>
          )}
          <Loader status={comments.status} error={comments.error}>
            {comments.byDestination.length === 0 ? (
              <Alert variant="light">Aucun commentaire pour le moment.</Alert>
            ) : (
              comments.byDestination.map((comment) => (
                <Card key={comment.id} className="mb-3 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <strong>{comment.author || `Utilisateur ${comment.userId}`}</strong>
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
              ))
            )}
          </Loader>

          <ConfirmModal
            show={showFavModal}
            title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            variant={isFavorite ? "danger" : "primary"}
            confirmLabel={isFavorite ? "Retirer" : "Ajouter"}
            onConfirm={confirmFavorite}
            onHide={() => setShowFavModal(false)}
          >
            {isFavorite
              ? `Retirer ${destination.name} de vos favoris ?`
              : `Ajouter ${destination.name} à vos favoris ?`}
          </ConfirmModal>
        </article>
      )}
    </Loader>
  );
}
