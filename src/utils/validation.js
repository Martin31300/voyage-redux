import * as yup from "yup";

export const passwordRule = yup
  .string()
  .required("Le mot de passe est obligatoire")
  .min(8, "Au moins 8 caractères")
  .matches(/[a-z]/, "Au moins une minuscule")
  .matches(/[A-Z]/, "Au moins une majuscule")
  .matches(/[0-9]/, "Au moins un chiffre")
  .matches(/[^a-zA-Z0-9]/, "Au moins un caractère spécial");
