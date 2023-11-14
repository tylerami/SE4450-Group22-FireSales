import { Currency } from "./enums/Currency";
import { PaymentMethod } from "./enums/PaymentMethod";
import { Timestamp, DocumentData } from "firebase/firestore";

export class Payout {
  userId: string;
  amount: number;
  currency: Currency;
  dateOccured: Date;
  dateRecorded: Date;
  paymentMethod: PaymentMethod;
  paymentAddress: string;

  constructor({
    userId,
    amount,
    currency = Currency.CAD,
    dateOccured,
    dateRecorded,
    paymentMethod,
    paymentAddress,
  }: {
    userId: string;
    amount: number;
    currency?: Currency;
    dateOccured: Date;
    dateRecorded: Date;
    paymentMethod: PaymentMethod;
    paymentAddress: string;
  }) {
    this.userId = userId;
    this.amount = amount;
    this.currency = currency;
    this.dateOccured = dateOccured;
    this.dateRecorded = dateRecorded;
    this.paymentMethod = paymentMethod;
    this.paymentAddress = paymentAddress;
  }

  toFirestoreDoc(): DocumentData {
    return {
      userId: this.userId,
      amount: this.amount,
      currency: this.currency,
      dateOccured: Timestamp.fromDate(this.dateOccured),
      dateRecorded: Timestamp.fromDate(this.dateRecorded),
      paymentMethod: this.paymentMethod,
      paymentAddress: this.paymentAddress,
    };
  }

  static fromFirestoreDoc(doc: DocumentData): Payout {
    return new Payout({
      userId: doc.userId,
      amount: doc.amount,
      currency: doc.currency,
      dateOccured: doc.dateOccured.toDate(),
      dateRecorded: doc.dateRecorded.toDate(),
      paymentMethod: doc.paymentMethod,
      paymentAddress: doc.paymentAddress,
    });
  }
}
