import { Currency } from "./enums/Currency";
import { PaymentMethod } from "./enums/PaymentMethod";
import { Timestamp, DocumentData } from "firebase/firestore";

export class Payout {
  id: string;
  userId: string;
  amount: number;
  currency: Currency;
  conversionIds?: string[];
  dateOccurred: Date;
  dateRecorded: Date;
  paymentMethod: PaymentMethod;
  paymentAddress: string;

  constructor({
    id,
    userId,
    amount,
    currency = Currency.CAD,
    conversionIds,
    dateOccurred,
    dateRecorded = new Date(),
    paymentMethod,
    paymentAddress,
  }: {
    id?: string;
    userId: string;
    amount: number;
    currency?: Currency;
    conversionIds?: string[];
    dateOccurred: Date;
    dateRecorded?: Date;
    paymentMethod: PaymentMethod;
    paymentAddress: string;
  }) {
    this.id = id ?? this.getPayoutId({ dateOccurred, dateRecorded, userId });
    this.userId = userId;
    this.amount = amount;
    this.currency = currency;
    this.conversionIds = conversionIds;
    this.dateOccurred = dateOccurred;
    this.dateRecorded = dateRecorded;
    this.paymentMethod = paymentMethod;
    this.paymentAddress = paymentAddress;
  }

  private getPayoutId({
    dateOccurred,
    dateRecorded,
    userId,
  }: {
    dateOccurred: Date;
    dateRecorded: Date;
    userId: string;
  }): string {
    return `${dateOccurred.toISOString()}_${dateRecorded.toISOString()}_${userId}`;
  }

  toFirestoreDoc(): DocumentData {
    return {
      id: this.id,
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
      id: doc.id,
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
