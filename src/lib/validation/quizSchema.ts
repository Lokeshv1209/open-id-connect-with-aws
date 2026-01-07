import * as Yup from "yup";

export const quizSchema = Yup.object().shape({
  questions: Yup.array()
    .of(
      Yup.object().shape({
        question: Yup.string().trim().required("Question should not be empty"),
        options: Yup.array()
          .of(
            Yup.object().shape({
              value: Yup.string().trim().required("Options should not be empty"),
            })
          )
          .required("Options are required"),
      })
    )
    .optional()
    .default([]),
});
