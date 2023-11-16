import { Currency } from "./enums/Currency";
import { PaymentMethod } from "./enums/PaymentMethod";
import { Timestamp, DocumentData } from "firebase/firestore";

export class Payout {
  userId: string;
  amount: number;
  currency: Currency;
  conversionIds?: string[];
  dateOccurred: Date;
  dateRecorded: Date;
  paymentMethod: PaymentMethod;
  paymentAddress: string;

  constructor({
    userId,
    amount,
    currency = Currency.CAD,
    conversionIds,
    dateOccurred,
    dateRecorded,
    paymentMethod,
    paymentAddress,
  }: {
    userId: string;
    amount: number;
    currency?: Currency;
    conversionIds?: string[];
    dateOccurred: Date;
    dateRecorded: Date;
    paymentMethod: PaymentMethod;
    paymentAddress: string;
  }) {
    this.userId = userId;
    this.amount = amount;
    this.currency = currency;
    this.conversionIds = conversionIds;
    this.dateOccurred = dateOccurred;
    this.dateRecorded = dateRecorded;
    this.paymentMethod = paymentMethod;
    this.paymentAddress = paymentAddress;
  }

  toFirestoreDoc(): DocumentData {
    return {
      userId: this.userId,
      amount: this.amount,
      currency: this.currency,
      dateOccurred: Timestamp.fromDate(this.dateOccurred),
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
      dateOccurred: doc.dateOccurred.toDate(),
      dateRecorded: doc.dateRecorded.toDate(),
      paymentMethod: doc.paymentMethod,
      paymentAddress: doc.paymentAddress,
    });
  }
}
