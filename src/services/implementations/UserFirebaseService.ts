import { User } from "models/User";
import { UserService } from "services/interfaces/UserService";

import {
  CollectionReference,
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ADMIN_COMP_GROUP_ID } from "models/CompensationGroup";

/**
 * Implementation of the UserService interface using Firebase Firestore.
 */
export class UserFirebaseService implements UserService {
  private db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  /**
   * Retrieves the hot takes account for a given user ID.
   * @param uid The user ID.
   * @returns The hot takes account information, or null if not found.
   */
  async getHotTakesAccount(
    uid: string
  ): Promise<{ email: string; fullName: string } | null> {
    const docRef = doc(this.hotTakesAccountsCollection(), uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    const data = docSnap.data();
    return {
      email: data.email,
      fullName: data.fullName,
    };
  }

  /**
   * Creates a new user.
   * @param user The user object.
   * @returns The created user.
   */
  async create(user: User): Promise<User> {
    console.log("creating user, ", user);
    const docRef = doc(this.usersCollection(), user.uid);
    await setDoc(docRef, user.toFirestoreDoc());
    return user;
  }

  /**
   * Retrieves a user by ID.
   * @param userId The user ID.
   * @returns The user object, or null if not found.
   */
  async get(userId: string): Promise<User | null> {
    console.log(`Getting user with id ${userId}`);
    const docRef = doc(this.usersCollection(), userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    console.log(`Found user with id ${userId}`);
    let user: User = User.fromFirestoreDoc(docSnap.data());

    return user;
  }

  /**
   * Updates a user.
   * @param user The updated user object.
   * @returns The updated user.
   */
  async update(user: User): Promise<User> {
    const docRef = doc(this.usersCollection(), user.uid);
    const res = await updateDoc(docRef, user.toFirestoreDoc());
    console.log("updated user", res, user.toFirestoreDoc(), user.uid);
    return user;
  }

  /**
   * Retrieves all users.
   * @param includeAdmins Whether to include admin users (default: false).
   * @returns An array of users.
   */
  async getAll(
    {
      includeAdmins = false,
    }: {
      includeAdmins?: boolean;
    } = { includeAdmins: false }
  ): Promise<User[]> {
    let userQuery = query(this.usersCollection());
    const userQuerySnapshot = await getDocs(userQuery);
    let users = userQuerySnapshot.docs.map((doc) =>
      User.fromFirestoreDoc(doc.data())
    );
    if (!includeAdmins) {
      users = users.filter((user) => !user.isAdmin());
    }

    for (let user of users) {
      if (user.isAdmin() && user.compensationGroupId !== ADMIN_COMP_GROUP_ID) {
        user = this.fixAdminCompGroup(user);
      } else if (
        !user.isAdmin() &&
        user.compensationGroupId === ADMIN_COMP_GROUP_ID
      ) {
        user = this.removeAdminCompGroup(user);
      }
    }

    return users;
  }

  private removeAdminCompGroup(user: User) {
    user = new User({
      ...user,
      compensationGroupId: null,
    });
    this.update(user);
    return user;
  }

  private fixAdminCompGroup(user: User) {
    user = new User({
      ...user,
      compensationGroupId: ADMIN_COMP_GROUP_ID,
    });
    console.log("fixing admin comp group", user);
    this.update(user);
    return user;
  }

  private hotTakesAccountsCollection(): CollectionReference {
    return collection(this.db, "users-v2");
  }

  private usersCollection(): CollectionReference {
    return collection(this.db, "salesUsers");
  }
}
