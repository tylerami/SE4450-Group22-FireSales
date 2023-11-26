import { CompensationGroup } from "models/CompensationGroup";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
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

export class CompensationGroupFirebaseService
  implements CompensationGroupService
{
  private db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async create(
    compensationGroup: CompensationGroup
  ): Promise<CompensationGroup> {
    const docRef = doc(
      this.compensationGroupsCollection(),
      compensationGroup.id
    );
    await setDoc(docRef, compensationGroup.toFirestoreDoc());
    return compensationGroup;
  }

  async set(compensationGroup: CompensationGroup): Promise<CompensationGroup> {
    const docRef = doc(
      this.compensationGroupsCollection(),
      compensationGroup.id
    );
    await setDoc(docRef, compensationGroup.toFirestoreDoc(), { merge: true });
    return compensationGroup;
  }
  async get(compensationGroupId: string): Promise<CompensationGroup | null> {
    const docRef = doc(
      this.compensationGroupsCollection(),
      compensationGroupId
    );
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return CompensationGroup.fromFirestoreDoc(docSnap.data());
  }
  async update(
    compensationGroup: CompensationGroup
  ): Promise<CompensationGroup> {
    const docRef = doc(
      this.compensationGroupsCollection(),
      compensationGroup.id
    );
    await updateDoc(docRef, compensationGroup.toFirestoreDoc());
    return compensationGroup as CompensationGroup;
  }
  async getAll(): Promise<CompensationGroup[]> {
    const compensationGroupQuerySnapshot = await getDocs(
      this.compensationGroupsCollection()
    );
    return compensationGroupQuerySnapshot.docs.map((doc) =>
      CompensationGroup.fromFirestoreDoc(doc.data())
    );
  }

  private compensationGroupsCollection(): CollectionReference {
    return collection(this.db, "compensationGroups");
  }
}
