import { DocumentData } from "firebase/firestore";

class RetentionIncentive {
  amount: number;
  monthlyLimit: number;
  clientId: string;

  constructor({
    clientId,
    amount,
    monthlyLimit,
  }: {
    clientId: string;
    amount: number;
    monthlyLimit: number;
  }) {
    this.clientId = clientId;
    this.amount = amount;
    this.monthlyLimit = monthlyLimit;
  }

  public toFirestoreDoc(): DocumentData {
    return {
      clientId: this.clientId,
      amount: this.amount,
      monthlyLimit: this.monthlyLimit,
    };
  }

  public static fromFirestoreDoc(doc: DocumentData): RetentionIncentive {
    return new RetentionIncentive({
      clientId: doc.clientId,
      amount: doc.amount,
      monthlyLimit: doc.monthlyLimit,
    });
  }
}

export default RetentionIncentive;
