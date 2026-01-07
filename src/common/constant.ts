import type { ReactNode } from "react";

import { ShieldDone, SolvedQuiz, Users3 } from "../../public/SvgIcons";

export interface IMenuList {
  label: string;
  image: ReactNode;
  path: string;
  key: string;
}

export const menulist = [
  // {
  //   label: "Feeds",
  //   image: TicketStar,
  //   path: "/feeds",
  //   key: "feeds",
  // },
  {
    label: "Questionnaires",
    image: ShieldDone,
    path: "/questionnaires",
    key: "questionnaires",
  },
  {
    label: "Solved Questionnaire",
    image: SolvedQuiz,
    path: "/solved-quiz",
    key: "solved-quiz",
  },
  {
    label: "Users",
    image: Users3,
    path: "/users",
    key: "users",
  },
];

export const MONTH_OPTIONS = [
  { key: 1, label: "January", value: "january" },
  { key: 2, label: "February", value: "february" },
  { key: 3, label: "March", value: "march" },
  { key: 4, label: "April", value: "april" },
  { key: 5, label: "May", value: "may" },
  { key: 6, label: "June", value: "june" },
  { key: 7, label: "July", value: "july" },
  { key: 8, label: "August", value: "august" },
  { key: 9, label: "September", value: "september" },
  { key: 10, label: "October", value: "october" },
  { key: 11, label: "November", value: "november" },
  { key: 12, label: "December", value: "december" },
];

export const getYearOptions = (startYear: number, endYear?: number) => {
  const currentYear = new Date().getFullYear();
  const lastYear = endYear ?? currentYear;

  return Array.from({ length: lastYear - startYear + 1 }, (_, i) => {
    const year = startYear + i;
    return { key: year, label: `${year}`, value: `${year}` };
  });
};
