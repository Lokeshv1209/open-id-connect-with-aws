import * as Yup from "yup";

export const createOrgSchema = Yup.object().shape({
  orgName: Yup.string().required("Organization name is required"),
  // orgDomain: Yup.string().required("Domain is required"),

  orgDomain: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string()
          .trim()
          .min(1, "Domain URL cannot be empty")
          .max(253, "Domain must be at most 253 characters")
          .required("Domain URL is required"),
      })
    )
    .min(1, "At least one domain is required"),

  adminEmail: Yup.string().required("Admin email is required").email("Enter a valid email"),
  adminName: Yup.string().required("Admin name is required"),

  logo: Yup.mixed<File | string>().nullable(),

  status: Yup.number(),
});
