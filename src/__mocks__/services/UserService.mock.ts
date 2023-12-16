import { User } from "models/User";
import { generateSampleUsers, sampleUser } from "__mocks__/models/User.mock";
import { UserService } from "services/interfaces/UserService";

export class MockUserService implements UserService {
  query({
    compensationGroupIds,
  }: {
    compensationGroupIds: string[];
  }): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  async getHotTakesAccount(uid: string): Promise<{
    email: string;
    fullName: string;
  } | null> {
    return null;
  }
  async create(user: User): Promise<User> {
    return user;
  }
  async get(userId: string): Promise<User | null> {
    return sampleUser;
  }
  async update(user: User | Partial<User>): Promise<User> {
    return user as User;
  }
  async getAll({
    includeAdmins = false,
  }: {
    includeAdmins?: boolean;
  } = {}): Promise<User[]> {
    return generateSampleUsers(10);
  }
}
