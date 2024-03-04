import { PaymentMethod } from "./enums/PaymentMethod";
import { DocumentData } from "firebase/firestore";

export class PayoutPreferrences {
  addressByMethod: { [key in PaymentMethod]?: string };
  preferredMethod: PaymentMethod;

  constructor({
    addressByMethod = {},
    preferredMethod = PaymentMethod.etransfer,
  }: {
    addressByMethod?: { [key in PaymentMethod]?: string };
    preferredMethod?: PaymentMethod;
  }) {
    this.addressByMethod = addressByMethod;
    this.preferredMethod = preferredMethod;
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
    };
  }

  static fromFirestoreDoc(doc: DocumentData): PayoutPreferrences {
    return new PayoutPreferrences({
      addressByMethod: doc.addressByMethod,
      preferredMethod: doc.preferredMethod,
    });
  }
}
