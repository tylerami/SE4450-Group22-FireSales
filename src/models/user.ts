import { CompensationPackage } from "./compensationPackage";

export class User {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    registeredAt: Date;
    compensation?: CompensationPackage;
    paymentDetails?: Map<string, any>;
    address?: Map<string, any>;

    constructor(
        uid: string,
        firstName: string,
        lastName: string,
        email: string,
        role: string,
        registeredAt: Date,
        compensation?: CompensationPackage,
        paymentDetails?: Map<string, any>,
        address?: Map<string, any>,
       
    ) {
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.compensation = compensation;
        this.paymentDetails = paymentDetails;
        this.address = address;
        this.registeredAt = registeredAt;
    }
}
