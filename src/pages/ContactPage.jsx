import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import FormField from "../components/FormField.jsx";
import { resetSend, sendContact } from "../store/contactSlice.js";

const schema = yup.object({
  name: yup.string().trim().required("Le nom est obligatoire"),
  email: yup.string().trim().email("L'email n'est pas valide").required("L'email est obligatoire"),
  subject: yup
    .string()
    .trim()
    .required("Le sujet est obligatoire")
    .min(5, "Le sujet doit avoir au moins 5 caractères"),
  message: yup
    .string()
    .trim()
    .required("Le message est obligatoire")
    .min(10, "Le message doit avoir au moins 10 caractères"),
});

export default function ContactPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { sendStatus, sendError } = useSelector((state) => state.contact);

  const fullName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username : "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    values: { name: fullName || "", email: user?.email || "", subject: "", message: "" },
  });

  useEffect(() => {
    dispatch(resetSend());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const payload = user?.id ? { ...data, user_id: user.id } : data;
    const result = await dispatch(sendContact(payload));
    if (sendContact.fulfilled.match(result)) {
      reset({ name: fullName || "", email: user?.email || "", subject: "", message: "" });
    }
  };

  return (
    <section>
      <h1 className="mb-4">Contact</h1>
      {sendStatus === "succeeded" && (
        <Alert variant="success" dismissible onClose={() => dispatch(resetSend())}>
          Votre message a bien été envoyé.
        </Alert>
      )}
      {sendStatus === "failed" && <Alert variant="danger">{sendError}</Alert>}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Nom" name="name" register={register} errors={errors} />
            <FormField label="Email" name="email" type="email" register={register} errors={errors} />
            <FormField label="Sujet" name="subject" register={register} errors={errors} />
            <FormField
              label="Message"
              name="message"
              as="textarea"
              rows={5}
              register={register}
              errors={errors}
            />
            <Button variant="outline-primary" type="submit" disabled={sendStatus === "loading"}>
              Envoyer
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </section>
  );
}
