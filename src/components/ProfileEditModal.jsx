import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { updateProfile } from "../store/usersSlice.js";
import FormField from "./FormField.jsx";

const schema = yup.object({
  username: yup.string().trim().required("Le nom d'utilisateur est obligatoire"),
  email: yup.string().trim().email("Email invalide").required("L'email est obligatoire"),
  firstName: yup.string().trim().required("Le prénom est obligatoire"),
  lastName: yup.string().trim().required("Le nom est obligatoire"),
  gender: yup.string(),
  avatar: yup.string().trim().url("L'avatar doit être une url valide"),
});

export const genderOptions = [
  { value: "", label: "Non précisé" },
  { value: "female", label: "Femme" },
  { value: "male", label: "Homme" },
  { value: "other", label: "Autre" },
];

export default function ProfileEditModal({ show, onHide, user }) {
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: user.username || "",
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      gender: user.gender || "",
      avatar: user.avatar || "",
    },
  });

  const submit = async (values) => {
    setError("");
    try {
      await dispatch(updateProfile(values)).unwrap();
      onHide();
    } catch (message) {
      setError(typeof message === "string" ? message : "Erreur");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form noValidate onSubmit={handleSubmit(submit)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier mes informations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <FormField label="Nom d'utilisateur" name="username" register={register} errors={errors} />
          <FormField label="Email" name="email" type="email" register={register} errors={errors} />
          <FormField label="Prénom" name="firstName" register={register} errors={errors} />
          <FormField label="Nom" name="lastName" register={register} errors={errors} />
          <FormField
            label="Genre"
            name="gender"
            options={genderOptions}
            register={register}
            errors={errors}
          />
          <FormField label="Avatar (url)" name="avatar" register={register} errors={errors} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
