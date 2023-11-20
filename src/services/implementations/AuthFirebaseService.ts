// AuthService.ts
import { User } from "models/User";
import { MockUserService } from "__mocks__/services/UserService.mock";
import { Providers, auth } from "config/firebase";
import {
  User as FirebaseUser,
  UserCredential,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { UserService } from "services/interfaces/UserService";
import { AuthService } from "services/interfaces/AuthService";
import { DependencyInjection } from "utils/DependencyInjection";

export class AuthFirebaseService implements AuthService {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<User | null> {
    const fbUserCredential: UserCredential | null =
      await signInWithEmailAndPassword(auth, email, password).catch((e) => {
        console.log(`Error signing in: ${e}`);
        return null;
      });

    const firebaseUser = fbUserCredential?.user;
    if (!firebaseUser) {
      return null;
    }

    const user = await this.userService.get(firebaseUser.uid);
    if (!user) {
      return this.handleHotTakesUserRegistration(firebaseUser);
    }
    return null;
  }

  public async signInWithGoogle(): Promise<User | null> {
    const fbUserCredential: UserCredential | null = await signInWithPopup(
      auth,
      Providers.google
    ).catch((e) => {
      console.log(`Error signing in: ${e}`);
      return null;
    });

    const firebaseUser = fbUserCredential?.user;
    if (!firebaseUser) {
      return null;
    }

    let user = await this.userService.get(firebaseUser.uid);
    if (!user) {
      user = await this.handleGoogleUserRegistration(firebaseUser);
    }

    return user;
  }

  public async registerWithEmail({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<User | null> {
    let fbUserCredential: UserCredential | null = null;
    try {
      fbUserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        console.log("Email already in use");
        throw new Error("Email already in use");
      }
      throw new Error("Error: password is invalid");
    }

    const firebaseUser = fbUserCredential?.user;
    if (!firebaseUser) {
      return null;
    }

    const newUser: User = User.create({
      uid: firebaseUser.uid,
      firstName,
      lastName,
      email,
    });
    return await this.userService.create(newUser);
  }

  public onUserStateChanged(callback: (user: User | null) => void) {
    auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }
      let user: User | null = await this.userService.get(firebaseUser.uid);
      if (user === null) {
        user = await this.handleGoogleUserRegistration(firebaseUser);
      }
      callback(user);
    });
  }

  private async handleGoogleUserRegistration(
    firebaseUser: FirebaseUser
  ): Promise<User | null> {
    const name = firebaseUser.displayName;
    const email = firebaseUser.email;

    if (!name || !email) {
      auth.signOut();
      return null;
    }
    const firstName = name.split(" ")[0];
    const lastName = name.includes(" ") ? name.split(" ")[1] : "";

    const newUser: User = User.create({
      uid: firebaseUser.uid,
      firstName,
      lastName,
      email: firebaseUser.email,
    });

    return newUser;
  }

  private async handleHotTakesUserRegistration(
    firebaseUser: FirebaseUser
  ): Promise<User | null> {
    const hottakesAccount = await this.userService.getHotTakesAccount(
      firebaseUser.uid
    );
    if (hottakesAccount === null) {
      auth.signOut();
      return null;
    }

    const name = hottakesAccount["fullName"];
    const firstName = name.split(" ")[0];
    const lastName = name.includes(" ") ? name.split(" ")[1] : "";
    const email = hottakesAccount["email"];

    const newUser: User = User.create({
      uid: firebaseUser.uid,
      firstName,
      lastName,
      email,
    });

    return await this.userService.create(newUser);
  }
}

const userService: UserService = DependencyInjection.userService();

export const authService = new AuthFirebaseService(userService);
