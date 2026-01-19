import * as Yup from "yup";

export const validations = {
  firstName: Yup.string()
    .min(2, "Too short")
    .required("First name is required"),

  lastName: Yup.string().min(2, "Too short").required("Last name is required"),

  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  agreeToTerms: Yup.boolean().oneOf([true], "You must agree to terms"),
  rememberMe: Yup.boolean().oneOf([true], "You must agree to terms"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/[a-z]/, "Must contain a lowercase letter")
    .matches(/[0-9]/, "Must contain a number")
    .matches(/[@$!%*?&#]/, "Must contain a special character")
    .required("Password is required"),
      passwordLogin: Yup.string()
    .required("Password is required"),
};
