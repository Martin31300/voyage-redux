import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { passwordRule } from "../utils/validation.js";
import FormField from "./FormField.jsx";

export default function PasswordModal({ show, onHide, title, requireCurrent, onSubmit }) {
  const [error, setError] = useState("");

  const schema = useMemo(
    () =>
      yup.object({
        ...(requireCurrent
          ? { currentPassword: yup.string().required("Le mot de passe actuel est obligatoire") }
          : {}),
        newPassword: passwordRule,
        confirmPassword: yup
          .string()
          .required("La confirmation est obligatoire")
          .oneOf([yup.ref("newPassword")], "Les mots de passe ne sont pas identiques"),
      }),
    [requireCurrent],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const close = () => {
    reset();
    setError("");
    onHide();
  };

  const submit = async (values) => {
    setError("");
    try {
      await onSubmit(values);
      close();
    } catch (err) {
      setError(err.message || "Erreur");
    }
  };

  return (
    <Modal show={show} onHide={close} centered>
      <Form noValidate onSubmit={handleSubmit(submit)}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {requireCurrent && (
            <FormField
              label="Mot de passe actuel"
              name="currentPassword"
              type="password"
              register={register}
              errors={errors}
            />
          )}
          <FormField
            label="Nouveau mot de passe"
            name="newPassword"
            type="password"
            register={register}
            errors={errors}
          />
          <FormField
            label="Confirmation"
            name="confirmPassword"
            type="password"
            register={register}
            errors={errors}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
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
