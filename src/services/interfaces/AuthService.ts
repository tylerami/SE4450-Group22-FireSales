import { User } from "src/models/User";

export interface AuthService {
  signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<User | null>;
  signInWithGoogle(): Promise<User | null>;
  registerWithEmail({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<User | null>;
  onUserStateChanged(callback: (user: User | null) => void): void;
}
