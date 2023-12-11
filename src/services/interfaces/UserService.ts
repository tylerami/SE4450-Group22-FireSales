import { User } from "models/User";

// Within the firestore implementation, these user documents will live in a collection called "salesUsers"
export interface UserService {
  getHotTakesAccount(uid: string): Promise<{
    email: string;
    fullName: string;
  } | null>;
  create(user: User): Promise<User>;
  get(userId: string): Promise<User | null>;
  update(user: User): Promise<User>;
  getAll({ includeAdmins }?: { includeAdmins: boolean }): Promise<User[]>;
}
