import { Boolean, Number, String, Literal, Array, Tuple, Record, Union, Static, Null } from 'runtypes'; 
 
 export interface DisplayType {
    customer: boolean,
    order: boolean
}

export   interface DispatchAction {
    type: string
}

export const Book = Record({
  code: String,
  title: String,
  type: String
});

export const SelectedBookQuantity = Record({
  book: Book,
  startCount: Number,
  endCount: Number.Or(Null),
  netCount: Number.Or(Null)
})

export type Book = Static<typeof Book>;

export type SelectedBookQuantity = Static<typeof SelectedBookQuantity>;

const Customer = Record({
  id: String,
  firstName: String, 
  lastName: String,
  postalCode: String, 
  email: String
});

export type Customer = Static<typeof Customer>;

export const Order = Record({
  books: Array(SelectedBookQuantity),
  customer: Customer.Or(Null),
  delivery: Boolean,
  channel: String,
  additionalNotes: String,
  deliveryNotes: String,
  creator: String.Or(Null)
})

export type Order  = Static<typeof Order>;