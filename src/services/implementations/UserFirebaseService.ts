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
  where,
} from "firebase/firestore";

export class UserFirebaseService implements UserService {
  private db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

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
  async create(user: User): Promise<User> {
    const docRef = doc(this.usersCollection(), user.uid);
    await setDoc(docRef, user.toFirestoreDoc());
    return user;
  }
  async get(userId: string): Promise<User | null> {
    console.log(`Getting user with id ${userId}`);
    const docRef = doc(this.usersCollection(), userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return User.fromFirestoreDoc(docSnap.data());
  }
  async update(user: User): Promise<User> {
    const docRef = doc(this.usersCollection(), user.uid);
    await updateDoc(docRef, user.toFirestoreDoc());
    return user;
  }
  async getAll(
    {
      includeAdmins = false,
    }: {
      includeAdmins?: boolean;
    } = { includeAdmins: false }
  ): Promise<User[]> {
    let userQuery = query(this.usersCollection());
    if (!includeAdmins) {
      // roles array must contain admin
      userQuery = query(userQuery, where("roles", "array-contains", "admin"));
    }
    const userQuerySnapshot = await getDocs(userQuery);
    return userQuerySnapshot.docs.map((doc) =>
      User.fromFirestoreDoc(doc.data())
    );
  }

  private hotTakesAccountsCollection(): CollectionReference {
    return collection(this.db, "users-v2");
  }

  private usersCollection(): CollectionReference {
    return collection(this.db, "salesUsers");
  }
}
