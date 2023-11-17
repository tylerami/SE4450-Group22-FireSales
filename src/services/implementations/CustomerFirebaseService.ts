import { Customer } from "models/Customer";
import { CustomerService } from "services/interfaces/CustomerService";
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

export class CustomerFirebaseService implements CustomerService {
  private db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async create(customer: Customer): Promise<Customer> {
    const docRef = doc(this.customersCollection(), customer.id);
    await setDoc(docRef, customer.toFirestoreDoc());
    return customer;
  }
  async get(customerId: string): Promise<Customer | null> {
    const docRef = doc(this.customersCollection(), customerId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return Customer.fromFirestoreDoc(docSnap.data());
  }
  async searchByName(fullName: string): Promise<Customer[]> {
    const customerQuery = query(
      this.customersCollection(),
      where("fullNameLowercase", ">=", fullName.toLowerCase()), // Use ">=" to search for names that start with the given parameter
      where("fullNameLowercase", "<=", fullName.toLowerCase() + "\uf8ff") // Use "\uf8ff" as an ending boundary for the search
    );
    const customerQuerySnapshot = await getDocs(customerQuery);
    return customerQuerySnapshot.docs.map((doc) =>
      Customer.fromFirestoreDoc(doc.data())
    );
  }
  async update(customer: Customer): Promise<Customer> {
    const customerId = customer.id;
    if (!customerId) {
      throw new Error("Customer must have an id to update");
    }
    const docRef = doc(this.customersCollection(), customerId);
    await updateDoc(docRef, customer.toFirestoreDoc());
    return customer;
  }
  async getAll(): Promise<Customer[]> {
    const customerQuerySnapshot = await getDocs(this.customersCollection());
    return customerQuerySnapshot.docs.map((doc) =>
      Customer.fromFirestoreDoc(doc.data())
    );
  }

  private customersCollection(): CollectionReference {
    return collection(this.db, "customers");
  }
}
