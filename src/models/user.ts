import { PaymentMethod } from "./enums/PaymentMethod";
import { Role } from "./enums/Role";
import { Timestamp, DocumentData } from "firebase/firestore";

export class User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  registeredAt: Date;
  compensationGroupId?: string;
  paymentDetails?: Map<PaymentMethod, string>;

  constructor({
    uid,
    firstName,
    lastName,
    email,
    roles = [Role.salesperson],
    registeredAt,
    compensationGroupId,
    paymentDetails,
  }: {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[];
    registeredAt: Date;
    compensationGroupId?: string;
    paymentDetails?: Map<PaymentMethod, string>;
  }) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.roles = roles;
    this.compensationGroupId = compensationGroupId;
    this.paymentDetails = paymentDetails;
    this.registeredAt = registeredAt;
  }

  public static create({
    uid,
    firstName,
    lastName,
    email,
    compensationGroupId,
  }: {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    compensationGroupId?: string;
  }): User {
    return new User({
      uid,
      firstName,
      lastName,
      email,
      roles: [Role.salesperson],
      registeredAt: new Date(),
      compensationGroupId,
    });
  }

  public isAdmin = () => this.roles.includes(Role.admin);

  public toFirestoreDoc(): DocumentData {
    const paymentDetailsObject = this.paymentDetails
      ? Object.fromEntries(this.paymentDetails)
      : {};

    return {
      uid: this.uid,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      roles: this.roles,
      registeredAt: this.registeredAt
        ? Timestamp.fromDate(this.registeredAt)
        : null,
      compensationGroupId: this.compensationGroupId,
      paymentDetails: paymentDetailsObject,
    };
  }

  public static fromFirestoreDoc(doc: DocumentData): User {
    const paymentDetailsMap = doc.paymentDetails
      ? new Map(Object.entries(doc.paymentDetails))
      : new Map();

    return new User({
      uid: doc.uid,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      roles: doc.roles,
      registeredAt: doc.registeredAt ? doc.registeredAt.toDate() : new Date(),
      compensationGroupId: doc.compensationGroupId,
      paymentDetails: paymentDetailsMap,
    });
  }
}
