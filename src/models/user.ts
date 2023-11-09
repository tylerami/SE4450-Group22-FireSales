import { generateUserID } from "@utils/Identification";
import { CompensationGroup } from "./CompensationGroup";
import { PaymentType } from "./enums/PaymentType";
import { Role } from "./enums/Role";

export class User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  registeredAt: Date;
  compensationGroupId?: string;
  paymentDetails?: Map<PaymentType, string>;

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
    paymentDetails?: Map<PaymentType, string>;
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
  }: {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
  }): User {
    return new User({
      uid,
      firstName,
      lastName,
      email,
      roles: [Role.salesperson],
      registeredAt: new Date(),
    });
  }

  public isAdmin = () => this.roles.includes(Role.admin);
}
