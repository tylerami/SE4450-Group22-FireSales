import { DocumentData, Timestamp } from "firebase/firestore";
import { User } from "./User";

class Announcement {
  createdByUid: string;
  createdAt: Date;
  body: string;
  title: string;
  global: boolean;
  compensationGroupIds: Set<string>;
  seenByUids: Set<string>;

  constructor({
    createdByUid,
    createdAt = new Date(),
    body,
    title,
    seenByUids = new Set(),
    global = false,
    compensationGroupIds = new Set(),
  }: {
    createdByUid: string;
    createdAt?: Date;
    body: string;
    title: string;
    seenByUids?: Set<string>;
    global?: boolean;
    compensationGroupIds?: Set<string>;
  }) {
    this.createdByUid = createdByUid;
    this.createdAt = createdAt;
    this.body = body;
    this.title = title;
    this.seenByUids = seenByUids;
    this.global = global;
    this.compensationGroupIds = compensationGroupIds;
  }

  public id(): string {
    return `${this.createdByUid}-${this.createdAt.getTime()}`;
  }

  public wasReadBy(user: User | null | undefined): boolean {
    if (!user) {
      return false;
    }
    return this.seenByUids.has(user.uid);
  }

  public markAsRead(uid: string): void {
    this.seenByUids.add(uid);
  }

  public toFirestoreDoc(): DocumentData {
    return {
      createdByUid: this.createdByUid,
      createdAt: Timestamp.fromDate(this.createdAt),
      body: this.body,
      title: this.title,
      seenByUids: Array.from(this.seenByUids),
      global: this.global,
      compensationGroupIds: Array.from(this.compensationGroupIds),
    };
  }

  public static fromFirestoreDoc(doc: DocumentData): Announcement {
    return new Announcement({
      createdByUid: doc.createdByUid,
      createdAt: doc.createdAt.toDate(),
      body: doc.body,
      title: doc.title,
      seenByUids: new Set(doc.seenByUids),
      global: doc.global,
      compensationGroupIds: new Set(doc.compensationGroupIds),
    });
  }
}

export default Announcement;
