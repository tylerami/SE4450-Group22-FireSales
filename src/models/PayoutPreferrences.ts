import { PaymentMethod } from "./enums/PaymentMethod";
import { DayOfTheWeek } from "./enums/Timeframe";
import { Timestamp, DocumentData } from "firebase/firestore";

export class PayoutPreferrences {
  addressByMethod: { [key in PaymentMethod]?: string };
  preferredMethod: PaymentMethod;
  preferredPayoutDay?: DayOfTheWeek;

  constructor({
    addressByMethod = {},
    preferredMethod = PaymentMethod.etransfer,
    preferredPayoutDay,
  }: {
    addressByMethod?: { [key in PaymentMethod]?: string };
    preferredMethod: PaymentMethod;
    preferredPayoutDay?: DayOfTheWeek;
  }) {
    this.addressByMethod = addressByMethod;
    this.preferredMethod = preferredMethod;
    this.preferredPayoutDay = preferredPayoutDay;
  }

  public getPreferredAddress(): string | undefined {
    return this.addressByMethod[this.preferredMethod];
  }

  public hasEtransferAddress(): boolean {
    return !!this.addressByMethod[PaymentMethod.etransfer];
  }

  public hasPaypalAddress(): boolean {
    return !!this.addressByMethod[PaymentMethod.paypal];
  }

  toFirestoreDoc(): DocumentData {
    return {
      addressByMethod: this.addressByMethod,
      preferredMethod: this.preferredMethod,
      preferredPayoutDay: this.preferredPayoutDay,
    };
  }

  static fromFirestoreDoc(doc: DocumentData): PayoutPreferrences {
    return new PayoutPreferrences({
      addressByMethod: doc.addressByMethod,
      preferredMethod: doc.preferredMethod,
      preferredPayoutDay: doc.preferredPayoutDay,
    });
  }
}