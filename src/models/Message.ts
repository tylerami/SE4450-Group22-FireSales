import { Timestamp, DocumentData } from "firebase/firestore";

export class Message {
  senderUid: string;
  receiverUid: string;
  message: string;
  timestamp: Date;

  constructor({
    senderUid,
    receiverUid,
    message,
    timestamp,
  }: {
    senderUid: string;
    receiverUid: string;
    message: string;
    timestamp: Date;
  }) {
    this.senderUid = senderUid;
    this.receiverUid = receiverUid;
    this.message = message;
    this.timestamp = timestamp;
  }

  public toFirestoreDoc(): DocumentData {
    return {
      senderUid: this.senderUid,
      receiverUid: this.receiverUid,
      message: this.message,
      timestamp: this.timestamp ? Timestamp.fromDate(this.timestamp) : null,
    };
  }

  public static fromFirestoreDoc(doc: DocumentData): Message {
    return new Message({
      senderUid: doc.senderUid,
      receiverUid: doc.receiverUid,
      message: doc.message,
      timestamp: doc.timestamp ? doc.timestamp.toDate() : new Date(),
    });
  }
}
