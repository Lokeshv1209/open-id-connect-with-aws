import * as Yup from "yup";

export const createCategorySchema = Yup.object().shape({
  categoryName: Yup.string()
    .required("Category name is required")
    .max(60, "Category name must be at most 60 characters"),

  description: Yup.string(),

  iconUrl: Yup.mixed<File | string>().nullable(),

  status: Yup.number().required("Status is required"),
});
