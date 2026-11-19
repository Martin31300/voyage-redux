import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import FormField from "../../components/FormField.jsx";
import Loader from "../../components/Loader.jsx";
import {
  createDestination,
  deleteDestination,
  fetchDestinations,
  fetchRegions,
} from "../../store/destinationsSlice.js";

const schema = yup.object({
  slug: yup.string().trim().required("Le slug est obligatoire"),
  name: yup.string().trim().required("Le nom est obligatoire"),
  region_id: yup.string().required("La région est obligatoire"),
  capital: yup.string().trim().required("La capitale est obligatoire"),
  description: yup.string().trim().required("La description est obligatoire"),
  image: yup.string().trim().required("L'image est obligatoire").url("Url invalide"),
  lat: yup.string().trim().required("La latitude est obligatoire"),
  long: yup.string().trim().required("La longitude est obligatoire"),
});

function CreateModal({ show, onHide, regions, onCreated }) {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      slug: "",
      name: "",
      region_id: "",
      capital: "",
      description: "",
      image: "",
      lat: "",
      long: "",
    },
  });

  const close = () => {
    reset();
    setError("");
    onHide();
  };

  const submit = async (values) => {
    setError("");
    try {
      await dispatch(createDestination({ ...values, region_id: Number(values.region_id) })).unwrap();
      onCreated(values.name);
      close();
    } catch (message) {
      setError(typeof message === "string" ? message : "Erreur");
    }
  };

  const regionOptions = [
    { value: "", label: "Choisir une région" },
    ...regions.map((r) => ({ value: String(r.id), label: r.name })),
  ];

  return (
    <Modal show={show} onHide={close} centered size="lg">
      <Form noValidate onSubmit={handleSubmit(submit)}>
        <Modal.Header closeButton>
          <Modal.Title>Nouvelle destination</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <FormField label="Nom" name="name" register={register} errors={errors} />
          <FormField label="Slug" name="slug" register={register} errors={errors} />
          <FormField label="Région" name="region_id" options={regionOptions} register={register} errors={errors} />
          <FormField label="Capitale" name="capital" register={register} errors={errors} />
          <FormField label="Description" name="description" as="textarea" rows={3} register={register} errors={errors} />
          <FormField label="Image (url)" name="image" register={register} errors={errors} />
          <FormField label="Latitude" name="lat" register={register} errors={errors} />
          <FormField label="Longitude" name="long" register={register} errors={errors} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Créer
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default function AdminDestinationsPage() {
  const dispatch = useDispatch();
  const { items, regions, status, error } = useSelector((state) => state.destinations);
  const user = useSelector((state) => state.auth.user);
  const [showCreate, setShowCreate] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    dispatch(fetchDestinations());
    dispatch(fetchRegions());
  }, [dispatch]);

  const confirmDelete = async () => {
    const target = toDelete;
    setToDelete(null);
    setActionError("");
    try {
      await dispatch(deleteDestination(target.id)).unwrap();
      setNotice(`${target.name} supprimée.`);
    } catch (message) {
      setActionError(typeof message === "string" ? message : "Erreur");
    }
  };

  return (
    <Loader status={status} error={error}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">{items.length} destination(s)</h2>
        <Button onClick={() => setShowCreate(true)}>Nouvelle destination</Button>
      </div>
      {notice && (
        <Alert variant="success" dismissible onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}
      {actionError && <Alert variant="danger">{actionError}</Alert>}
      <Table responsive hover className="align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Slug</th>
            <th>Région</th>
            <th>Capitale</th>
            <th>Créée par</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((destination) => (
            <tr key={destination.id}>
              <td>{destination.id}</td>
              <td>{destination.name}</td>
              <td>{destination.slug}</td>
              <td>{destination.regionName}</td>
              <td>{destination.capital}</td>
              <td>{destination.creatorName ?? destination.createdBy ?? "-"}</td>
              <td className="text-end">
                {user?.id !== undefined && String(destination.createdBy) === String(user.id) && (
                  <Button size="sm" variant="outline-danger" onClick={() => setToDelete(destination)}>
                    Supprimer
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CreateModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        regions={regions}
        onCreated={(name) => setNotice(`${name} créée.`)}
      />
      <ConfirmModal
        show={!!toDelete}
        title="Supprimer la destination"
        confirmLabel="Supprimer"
        onConfirm={confirmDelete}
        onHide={() => setToDelete(null)}
      >
        Supprimer définitivement {toDelete?.name} ? Cette action est irréversible.
      </ConfirmModal>
    </Loader>
  );
}
