import { Customer } from "models/Customer";
import { CustomerService } from "services/interfaces/CustomerService";

export class MockCustomerService implements CustomerService {
  async searchByName(fullName: string): Promise<Customer[]> {
    return [];
  }
  async create(customer: Customer): Promise<Customer> {
    return customer;
  }
  async get(customerId: string): Promise<Customer | null> {
    return null;
  }
  async update(customer: Customer | Partial<Customer>): Promise<Customer> {
    return customer as Customer;
  }
  async getAll(): Promise<Customer[]> {
    return [];
  }
}
