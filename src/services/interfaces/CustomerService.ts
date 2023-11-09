import { Customer } from "@models/Customer";

export interface CustomerService {
  create(customer: Customer): Promise<Customer>;
  get(customerId: string): Promise<Customer | null>;
  update(customer: Customer | Partial<Customer>): Promise<Customer>;
  getAll(): Promise<Customer[]>;
}
