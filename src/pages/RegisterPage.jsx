import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import FormField from "../components/FormField.jsx";
import { genderOptions } from "../components/ProfileEditModal.jsx";
import { clearAuthErrors, registerUser } from "../store/authSlice.js";
import { avatarFor } from "../utils/normalize.js";
import { passwordRule } from "../utils/validation.js";

const schema = yup.object({
  username: yup
    .string()
    .trim()
    .required("Le nom d'utilisateur est obligatoire")
    .min(4, "Le nom d'utilisateur doit avoir au moins 4 caractères"),
  password: passwordRule,
  email: yup.string().trim().required("L'email est obligatoire").email("L'email n'est pas valide"),
  firstName: yup.string().trim().required("Le prénom est obligatoire"),
  lastName: yup.string().trim().required("Le nom est obligatoire"),
  gender: yup.string(),
  avatar: yup.string().trim().url("L'avatar doit être une url valide"),
});

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerStatus, registerError } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      gender: "",
      avatar: "",
    },
  });

  useEffect(() => {
    dispatch(clearAuthErrors());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const body = { ...data, avatar: data.avatar || avatarFor(data.username) };
    const result = await dispatch(registerUser(body));
    if (registerUser.fulfilled.match(result)) {
      navigate("/login", { state: { registered: true } });
    }
  };

  return (
    <section>
      <h1 className="mb-4">Inscription</h1>
      {registerStatus === "failed" && <Alert variant="danger">{registerError}</Alert>}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Nom d'utilisateur" name="username" register={register} errors={errors} />
            <FormField label="Mot de passe" name="password" type="password" register={register} errors={errors} />
            <FormField label="Email" name="email" type="email" register={register} errors={errors} />
            <FormField label="Prénom" name="firstName" register={register} errors={errors} />
            <FormField label="Nom" name="lastName" register={register} errors={errors} />
            <FormField label="Genre (facultatif)" name="gender" options={genderOptions} register={register} errors={errors} />
            <FormField
              label="Avatar (url, facultatif - généré avec DiceBear si vide)"
              name="avatar"
              register={register}
              errors={errors}
            />
            <Button variant="outline-primary" type="submit" disabled={registerStatus === "loading"}>
              S'inscrire
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </section>
  );
}
