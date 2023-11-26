import { Timestamp, DocumentData } from "firebase/firestore";
import { User } from "./User";

export class Message {
  senderUid: string;
  receiverUid: string | "ADMIN";
  body: string;
  timestamp: Date;

  constructor({
    senderUid,
    receiverUid = "ADMIN",
    body,
    timestamp,
  }: {
    senderUid: string;
    receiverUid?: string | "ADMIN";
    body: string;
    timestamp: Date;
  }) {
    this.senderUid = senderUid;
    this.receiverUid = receiverUid;
    this.body = body;
    this.timestamp = timestamp;
  }

  public senderIsAdmin(): boolean {
    return this.receiverUid !== "ADMIN";
  }

  public fromSelf(currentUser: User | null) {
    if (!currentUser) return false;
    return this.senderUid === currentUser.uid;
  }

  public toFirestoreDoc(): DocumentData {
    return {
      senderUid: this.senderUid,
      receiverUid: this.receiverUid,
      body: this.body,
      timestamp: this.timestamp ? Timestamp.fromDate(this.timestamp) : null,
    };
  }

  public static fromFirestoreDoc(doc: DocumentData): Message {
    return new Message({
      senderUid: doc.senderUid,
      receiverUid: doc.receiverUid,
      body: doc.body,
      timestamp: doc.timestamp ? doc.timestamp.toDate() : new Date(),
    });
  }
}
