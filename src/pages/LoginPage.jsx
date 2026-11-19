import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import FormField from "../components/FormField.jsx";
import { clearAuthErrors, loginUser } from "../store/authSlice.js";

const schema = yup.object({
  username: yup.string().trim().required("Le nom d'utilisateur est obligatoire"),
  password: yup.string().required("Le mot de passe est obligatoire"),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || "/profile";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues: { username: "", password: "" } });

  useEffect(() => {
    dispatch(clearAuthErrors());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <section>
      <h1 className="mb-4">Connexion</h1>
      {location.state?.registered && (
        <Alert variant="success">Compte créé, vous pouvez vous connecter.</Alert>
      )}
      {status === "failed" && <Alert variant="danger">{error}</Alert>}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Nom d'utilisateur" name="username" register={register} errors={errors} />
            <FormField label="Mot de passe" name="password" type="password" register={register} errors={errors} />
            <Button variant="outline-primary" type="submit" disabled={status === "loading"}>
              Se connecter
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </section>
  );
}
