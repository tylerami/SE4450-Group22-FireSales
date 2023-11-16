import { PayoutPreferrences } from "./PayoutPreferrences";
import { Role } from "./enums/Role";
import { Timestamp, DocumentData } from "firebase/firestore";

export class User {
  uid: string;
  profilePictureSrc?: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  phone?: string;
  registeredAt: Date;
  compensationGroupId?: string;
  payoutPreferrences?: PayoutPreferrences;

  constructor({
    uid,
    profilePictureSrc,
    firstName,
    lastName,
    email,
    phone,
    roles = [Role.salesperson],
    registeredAt,
    compensationGroupId,
    payoutPreferrences,
  }: {
    uid: string;
    profilePictureSrc?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    roles: Role[];
    registeredAt: Date;
    compensationGroupId?: string;
    payoutPreferrences?: PayoutPreferrences;
  }) {
    this.uid = uid;
    this.profilePictureSrc = profilePictureSrc;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.roles = roles;
    this.phone = phone;
    this.compensationGroupId = compensationGroupId;
    this.payoutPreferrences = payoutPreferrences;
    this.registeredAt = registeredAt;
  }

  public static create({
    uid,
    profilePictureSrc,
    firstName,
    lastName,
    email,
    compensationGroupId,
  }: {
    uid: string;
    profilePictureSrc?: string;
    firstName: string;
    lastName: string;
    email: string;
    compensationGroupId?: string;
  }): User {
    return new User({
      uid,
      profilePictureSrc,
      firstName,
      lastName,
      email,
      roles: [Role.salesperson],
      registeredAt: new Date(),
      compensationGroupId,
    });
  }

  public isAdmin = () => this.roles.includes(Role.admin);
  public isSalesperson = () => this.roles.includes(Role.salesperson);

  public getFullName = () => `${this.firstName} ${this.lastName}`;

  public toFirestoreDoc(): DocumentData {
    return {
      uid: this.uid,
      profilePictureSrc: this.profilePictureSrc,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      roles: this.roles,
      registeredAt: this.registeredAt
        ? Timestamp.fromDate(this.registeredAt)
        : null,
      compensationGroupId: this.compensationGroupId,
      payoutPreferrences: this.payoutPreferrences?.toFirestoreDoc() ?? null,
    };
  }

  public static fromFirestoreDoc(doc: DocumentData): User {
    return new User({
      uid: doc.uid,
      profilePictureSrc: doc.profilePictureSrc,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      roles: doc.roles,
      registeredAt: doc.registeredAt ? doc.registeredAt.toDate() : new Date(),
      compensationGroupId: doc.compensationGroupId,
      payoutPreferrences: doc.payoutPreferrences
        ? PayoutPreferrences.fromFirestoreDoc(doc.payoutPreferrences)
        : undefined,
    });
  }
}
