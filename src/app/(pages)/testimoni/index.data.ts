export type productCategory =
  | "Wedding"
  | "Graduation"
  | "Party"
  | "Yearbook"
  | "Birthday"
  | "Maternity"
  | "Engangement"
    | "Prewedding";
  
interface IProductCategory {
  label: productCategory;
  value: string;
}

export const ProductCategory: IProductCategory[] = [
  {
    label: "Wedding",
    value: "wedding",
  },
  {
    label: "Graduation",
    value: "graduation",
  },
  {
    label: "Party",
    value: "party",
  },
  {
    label: "Yearbook",
    value: "yearbook",
  },
  {
    label: "Maternity",
    value: "maternity",
  },
  {
    label: "Birthday",
    value: "birthday",
  },
  {
    label: "Engangement",
    value: "engangement",
  },
  {
    label: "Prewedding",
    value: "prewedding",
  },
];
