import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().required("Email is required").email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const setPasswordSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[@$!%*?&#^()_\-+=]/, "Password must contain at least one special character"),
  confirmPass: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
