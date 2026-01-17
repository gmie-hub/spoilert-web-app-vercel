import * as Yup from "yup";

export const validations = Yup.object({
  firstName: Yup.string()
    .min(2, "Too short")
    .required("First name is required"),

  lastName: Yup.string()
    .min(2, "Too short")
    .required("Last name is required"),

  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /[A-Z]/,
      "Password must contain at least one uppercase letter"
    )
    .matches(
      /[a-z]/,
      "Password must contain at least one lowercase letter"
    )
    .matches(/[0-9]/, "Password must contain a number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain a special character"
    )
    .required("Password is required"),
});
