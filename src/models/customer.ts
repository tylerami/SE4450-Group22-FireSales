import { generateUserID } from "models/utils/Identification";
import { Timestamp, DocumentData } from "firebase/firestore";

// Deprecate function
export function customerIdFromName(fullName: string) {
  return fullName.replaceAll(" ", "_").toLowerCase();
}

export class Customer {
  id: string;
  fullName: string;
  email: string | null;

  constructor({
    fullName,
    id = generateUserID(),
    email = null,
  }: {
    id?: string;
    fullName: string;
    email?: string | null;
  }) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
  }

  public toFirestoreDoc(): DocumentData {
    return {
      id: this.id,
      fullName: this.fullName,
      fullnameLowercase: this.fullName.toLowerCase(),
      email: this.email,
    };
  }

  public static fromFirestoreDoc(doc: DocumentData): Customer {
    return new Customer({
      id: doc.id,
      fullName: doc.fullName,
      email: doc.email,
    });
  }
}
