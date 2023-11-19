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
import { ImageService } from "services/interfaces/ImageService";

export class ClientFirebaseService implements ClientService {
  private db: Firestore;
  private imageService: ImageService;

  constructor(db: Firestore, imageService: ImageService) {
    this.db = db;
    this.imageService = imageService;
  }

  async set(client: Client): Promise<Client> {
    const docRef = doc(this.clientsCollection(), client.id);
    await setDoc(docRef, client.toFirestoreDoc(), { merge: true });
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

  async getAll(): Promise<Client[]> {
    const clientQuerySnapshot = await getDocs(this.clientsCollection());
    return clientQuerySnapshot.docs.map((doc) =>
      Client.fromFirestoreDoc(doc.data())
    );
  }

  private clientsCollection(): CollectionReference {
    return collection(this.db, "clients");
  }

  async uploadLogo(clientId: string, logo: File): Promise<string> {
    return await this.imageService.uploadImage(
      `clients/logos/${clientId}.png`,
      logo
    );
  }
  async getLogoUrl(clientId: string): Promise<string | null> {
    return await this.imageService.getImageUrl(`clients/logos/${clientId}.png`);
  }
}
