import { Client } from "models/Client";
import { ClientService } from "services/interfaces/ClientService";
import {
  CollectionReference,
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export class ClientFirebaseService implements ClientService {
  private db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async create(client: Client): Promise<Client> {
    const docRef = doc(this.clientsCollection(), client.id);
    await setDoc(docRef, client.toFirestoreDoc());
    return client;
  }
  async get(clientId: string): Promise<Client | null> {
    const docRef = doc(this.clientsCollection(), clientId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return Client.fromFirestoreDoc(docSnap.data());
  }
  async update(client: Client): Promise<Client> {
    const docRef = doc(this.clientsCollection(), client.id);
    await updateDoc(docRef, client.toFirestoreDoc());
    return client;
  }
  async getAll(): Promise<Client[]> {
    const clientQuerySnapshot = await getDocs(this.clientsCollection());
    return clientQuerySnapshot.docs.map((doc) =>
      Client.fromFirestoreDoc(doc.data())
    );
  }

  private clientsCollection(): CollectionReference {
    return collection(this.db, "clients");
  }
}
