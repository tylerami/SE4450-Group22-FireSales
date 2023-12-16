import {
  CollectionReference,
  Firestore,
  Query,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Announcement from "models/Announcement";
import AnnouncementService from "services/interfaces/AnnouncementService";

class AnnouncementFirebaseService implements AnnouncementService {
  private db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async getAll(): Promise<Announcement[]> {
    const queryRef: Query = query(
      this.announcementsCollectionReference(),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(queryRef);
    const announcements: Announcement[] = querySnapshot.docs.map((doc) =>
      Announcement.fromFirestoreDoc(doc.data())
    );
    return announcements;
  }
  async create(announcement: Announcement): Promise<void> {
    const docRef = await doc(
      this.announcementsCollectionReference(),
      announcement.id()
    );

    await setDoc(docRef, announcement.toFirestoreDoc());
  }
  async delete(announcement: Announcement): Promise<void> {
    const docRef = await doc(
      this.announcementsCollectionReference(),
      announcement.id()
    );

    await deleteDoc(docRef);
  }
  async markAsRead(announcement: Announcement, userId: string): Promise<void> {
    const docRef = await doc(
      this.announcementsCollectionReference(),
      announcement.id()
    );

    announcement.markAsRead(userId);
    await updateDoc(docRef, announcement.toFirestoreDoc());
  }

  private announcementsCollectionReference(): CollectionReference {
    return collection(this.db, "announcements");
  }
}

export default AnnouncementFirebaseService;
