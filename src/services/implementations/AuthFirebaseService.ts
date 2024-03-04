import { User } from "src/models/User";
import { Providers, auth } from "config/firebase";
import {
  User as FirebaseUser,
  UserCredential,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { UserService } from "services/interfaces/UserService";
import { AuthService } from "services/interfaces/AuthService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";

/**
 * Implementation of the AuthService interface using Firebase authentication.
 */
export class AuthFirebaseService implements AuthService {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Sign in with email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns A Promise that resolves to the authenticated user or null if authentication fails.
   */
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

    let user = await this.userService.get(firebaseUser.uid);
    if (!user) {
      user = await this.handleHotTakesUserRegistration(firebaseUser);
    }
    return user;
  }

  /**
   * Sign in with Google.
   * @returns A Promise that resolves to the authenticated user or null if authentication fails.
   */
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

  /**
   * Register a new user with email and password.
   * @param firstName - The user's first name.
   * @param lastName - The user's last name.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns A Promise that resolves to the created user or null if registration fails.
   * @throws Error if the email is already in use or the password is invalid.
   */
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

  /**
   * Listen for changes in the user's authentication state.
   * @param callback - A callback function that will be called with the current user or null.
   */
  public onUserStateChanged(callback: (user: User | null) => void) {
    auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }
      let user: User | null = await this.userService.get(firebaseUser.uid);
      if (user === null) {
        console.log("User not found, registering new user");
        user = await this.handleGoogleUserRegistration(firebaseUser);
      }
      callback(user);
    });
  }

  public async signOut(callback: (() => void) | null = null): Promise<void> {
    await signOut(auth);
    if (callback) {
      callback();
    }
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

    return await this.userService.create(newUser);
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
