import {
  Boolean,
  Number,
  String,
  Literal,
  Array,
  Tuple,
  Record,
  Union,
  Static,
  Null,
} from "runtypes";

export interface DisplayType {
  customer: boolean;
  order: boolean;
}

export interface DispatchAction {
  type: string;
}

export const Book = Record({
  code: String,
  title: String,
  type: String,
});

export const SelectedBookQuantity = Record({
  book: Book,
  startCount: Number,
  endCount: Number.Or(Null),
  netCount: Number.Or(Null),
});

export type Book = Static<typeof Book>;

export type SelectedBookQuantity = Static<typeof SelectedBookQuantity>;

export const Product = Record({
  id: String,
  title: String,
  type: String,
  code: String,
});

export const SelectedProductQuantity = Record({
  product: Product,
  startCount: Number,
  endCount: Number.Or(Null),
  netCount: Number.Or(Null),
});

export type Product = Static<typeof Product>;

export type SelectedProductQuantity = Static<typeof SelectedProductQuantity>;

const Customer = Record({
  id: String,
  firstName: String,
  lastName: String,
  postalCode: String,
  email: String,
});

export type Customer = Static<typeof Customer>;

export const Order = Record({
  products: Array(SelectedProductQuantity),
  customer: Customer.Or(Null),
  anonymousCustomer: String.Or(Null),
  delivery: Boolean,
  channel: String,
  additionalNotes: String,
  deliveryNotes: String,
  creator: String.Or(Null),
});

export type Order = Static<typeof Order>;
