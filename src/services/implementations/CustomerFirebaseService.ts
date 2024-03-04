import { Customer } from "src/models/Customer";
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

/**
 * Implementation of the CustomerService interface that interacts with Firebase Firestore.
 */
export class CustomerFirebaseService implements CustomerService {
  private db: Firestore;

  /**
   * Constructs a new instance of CustomerFirebaseService.
   * @param db The Firestore instance to use for database operations.
   */
  constructor(db: Firestore) {
    this.db = db;
  }

  /**
   * Creates a new customer in the database.
   * @param customer The customer object to create.
   * @returns A Promise that resolves to the created customer.
   */
  async create(customer: Customer): Promise<Customer> {
    const docRef = doc(this.customersCollection(), customer.id);
    await setDoc(docRef, customer.toFirestoreDoc());
    return customer;
  }

  /**
   * Retrieves a customer from the database by ID.
   * @param customerId The ID of the customer to retrieve.
   * @returns A Promise that resolves to the retrieved customer, or null if not found.
   */
  async get(customerId: string): Promise<Customer | null> {
    const docRef = doc(this.customersCollection(), customerId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return Customer.fromFirestoreDoc(docSnap.data());
  }

  /**
   * Searches for customers in the database by full name.
   * @param fullName The full name to search for.
   * @returns A Promise that resolves to an array of matching customers.
   */
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

  /**
   * Updates a customer in the database.
   * @param customer The customer object to update.
   * @returns A Promise that resolves to the updated customer.
   * @throws Error if the customer does not have an ID.
   */
  async update(customer: Customer): Promise<Customer> {
    const customerId = customer.id;
    if (!customerId) {
      throw new Error("Customer must have an id to update");
    }
    const docRef = doc(this.customersCollection(), customerId);
    await updateDoc(docRef, customer.toFirestoreDoc());
    return customer;
  }

  /**
   * Retrieves all customers from the database.
   * @returns A Promise that resolves to an array of all customers.
   */
  async getAll(): Promise<Customer[]> {
    const customerQuerySnapshot = await getDocs(this.customersCollection());
    return customerQuerySnapshot.docs.map((doc) =>
      Customer.fromFirestoreDoc(doc.data())
    );
  }

  /**
   * Returns the Firestore collection reference for the "customers" collection.
   * @returns The Firestore collection reference.
   */
  private customersCollection(): CollectionReference {
    return collection(this.db, "customers");
  }
}
