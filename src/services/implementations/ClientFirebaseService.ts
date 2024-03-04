import { Client } from "src/models/Client";
import { ClientService } from "services/interfaces/ClientService";
import {
  CollectionReference,
  Firestore,
  Timestamp,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { ImageService } from "services/interfaces/ImageService";

/**
 * Implementation of the ClientService interface that interacts with Firebase.
 */
export class ClientFirebaseService implements ClientService {
  private db: Firestore;
  private imageService: ImageService;

  /**
   * Constructs a new instance of the ClientFirebaseService.
   * @param db The Firestore instance.
   * @param imageService The ImageService instance.
   */
  constructor(db: Firestore, imageService: ImageService) {
    this.db = db;
    this.imageService = imageService;
  }

  /**
   * Sets the client data in the Firestore database.
   * @param client The client object to be set.
   * @returns A Promise that resolves to the updated client object.
   */
  async set(client: Client): Promise<Client> {
    const docRef = doc(this.clientsCollection(), client.firestoreDocId());
    await setDoc(docRef, client.toFirestoreDoc(), { merge: true });
    return client;
  }

  /**
   * Retrieves the client data from the Firestore database.
   * @param clientId The ID of the client to retrieve.
   * @param timestamp The optional timestamp to filter the results.
   * @returns A Promise that resolves to the retrieved client object, or null if not found.
   */
  async get(
    clientId: string,
    timestamp: Date | null = null
  ): Promise<Client | null> {
    let queryRef = query(this.clientsCollection(), where("id", "==", clientId));

    if (timestamp) {
      queryRef = query(
        queryRef,
        where("timestamp", "<=", Timestamp.fromDate(timestamp))
      );
    }
    queryRef = query(queryRef, orderBy("timestamp", "desc"));

    const docSnap = await getDocs(queryRef);
    if (docSnap.empty || docSnap.docs.length === 0) {
      return null;
    }
    return Client.fromFirestoreDoc(docSnap.docs[0].data());
  }

  /**
   * Retrieves all clients from the Firestore database.
   * @returns A Promise that resolves to an array of client objects.
   */
  async getAll(): Promise<Client[]> {
    const queryRef = query(
      this.clientsCollection(),
      orderBy("timestamp", "desc")
    );

    const clientQuerySnapshot = await getDocs(queryRef);

    const clients: Client[] = [];
    const clientIds: Set<string> = new Set();

    clientQuerySnapshot.docs.forEach((doc) => {
      const client = Client.fromFirestoreDoc(doc.data());
      if (!clientIds.has(client.id)) {
        clients.push(client);
        clientIds.add(client.id);
      }
    });

    return clients;
  }

  /**
   * Retrieves the history of a client from the Firestore database.
   * @param clientId The ID of the client to retrieve the history for.
   * @returns A Promise that resolves to an array of client objects.
   */
  async getHistory(clientId: string): Promise<Client[]> {
    const queryRef = query(
      this.clientsCollection(),
      where("id", "==", clientId),
      orderBy("timestamp", "desc")
    );

    const clientQuerySnapshot = await getDocs(queryRef);

    return clientQuerySnapshot.docs.map((doc) =>
      Client.fromFirestoreDoc(doc.data())
    );
  }

  /**
   * Returns the Firestore collection reference for clients.
   * @returns The Firestore CollectionReference for clients.
   */
  private clientsCollection(): CollectionReference {
    return collection(this.db, "clients");
  }

  /**
   * Uploads the client logo to the storage.
   * @param clientId The ID of the client.
   * @param logo The logo file to be uploaded.
   * @returns A Promise that resolves to the URL of the uploaded logo.
   */
  async uploadLogo(clientId: string, logo: File): Promise<string> {
    return await this.imageService.uploadImage(
      `clients/logos/${clientId}.png`,
      logo
    );
  }

  /**
   * Retrieves the URL of the client logo from the storage.
   * @param clientId The ID of the client.
   * @returns A Promise that resolves to the URL of the client logo, or null if not found.
   */
  async getLogoUrl(clientId: string): Promise<string | null> {
    return await this.imageService.getImageUrl(`clients/logos/${clientId}.png`);
  }
}
