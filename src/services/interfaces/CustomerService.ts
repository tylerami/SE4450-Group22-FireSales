import { Customer } from "src/models/Customer";

export interface CustomerService {
  create(customer: Customer): Promise<Customer>;
  get(customerId: string): Promise<Customer | null>;
  searchByName(fullName: string): Promise<Customer[]>;
  update(customer: Customer): Promise<Customer>;
  getAll(): Promise<Customer[]>;
}
