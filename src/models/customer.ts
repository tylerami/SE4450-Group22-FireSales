

export class Customer{
    customerId: string;
    fullName: string;
    email: string;

    constructor(customerId: string, fullName: string, email: string) {
        this.customerId = customerId;
        this.fullName = fullName;
        this.email = email;
    }
}