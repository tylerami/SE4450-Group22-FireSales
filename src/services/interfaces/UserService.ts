import { User } from "@models/User";

// Within the firestore implementation, these user documents will live in a collection called "salesUsers"
export interface UserService {
  create(user: User): Promise<User>;
  get(userId: string): Promise<User | null>;
  update(user: User | Partial<User>): Promise<User>;
  getAll({ includeAdmins }: { includeAdmins: boolean }): Promise<User[]>;
}
