import { User } from "@models/User";
import { UserService } from "services/interfaces/UserService";

export class MockUserService implements UserService {
  async create(user: User): Promise<User> {
    return user;
  }
  async get(userId: string): Promise<User | null> {
    return null;
  }
  async update(user: User | Partial<User>): Promise<User> {
    return user as User;
  }
  async getAll({ includeAdmins }: { includeAdmins: boolean }): Promise<User[]> {
    return [];
  }
}
