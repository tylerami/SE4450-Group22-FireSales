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

  public isAdmin = () => this.roles.includes(Role.admin);
}
