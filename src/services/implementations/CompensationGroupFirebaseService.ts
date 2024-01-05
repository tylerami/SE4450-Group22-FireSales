import { CompensationGroup } from "models/CompensationGroup";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import {
  CollectionReference,
  Firestore,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

/**
 * Service implementation for managing compensation groups in Firebase.
 */
export class CompensationGroupFirebaseService
  implements CompensationGroupService
{
  private db: Firestore;

  /**
   * Constructs a new instance of CompensationGroupFirebaseService.
   * @param db The Firestore instance.
   */
  constructor(db: Firestore) {
    this.db = db;
  }

  async getAllAssignmentCodeCompGroupIds(): Promise<
    Record<string, string | null>
  > {
    const collection = this.assignmentCodesCollection();
    const queryRef = query(collection);

    const docSnap = await getDocs(queryRef);
    if (docSnap.empty) {
      return {};
    }

    const result: Record<string, string | null> = {};
    docSnap.docs.forEach((doc) => {
      result[doc.id] = doc.data().compensationGroupId ?? null;
    });
    return result;
  }

  async getAssignmentCodeCompGroupId(code: string): Promise<string | null> {
    const collection = this.assignmentCodesCollection();
    const docRef = doc(collection, code);

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return docSnap.data()?.compensationGroupId ?? null;
  }
  async setAssignmentCodeCompGroupId(
    code: string,
    compGroupId: string | null
  ): Promise<void> {
    const collection = this.assignmentCodesCollection();
    const docRef = doc(collection, code);
    await updateDoc(docRef, { compensationGroupId: compGroupId });
  }

  /**
   * Creates a new compensation group in Firestore.
   * @param compensationGroup The compensation group to create.
   * @returns The created compensation group.
   */
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

  /**
   * Sets the data of an existing compensation group in Firestore.
   * @param compensationGroup The compensation group to set.
   * @returns The updated compensation group.
   */
  async set(compensationGroup: CompensationGroup): Promise<CompensationGroup> {
    const docRef = doc(
      this.compensationGroupsCollection(),
      compensationGroup.firestoreDocId()
    );
    await setDoc(docRef, compensationGroup.toFirestoreDoc(), { merge: true });
    return compensationGroup;
  }

  /**
   * Retrieves a compensation group from Firestore by its ID.
   * @param compensationGroupId The ID of the compensation group to retrieve.
   * @param timestamp The optional timestamp to filter the results.
   * @returns The retrieved compensation group, or null if not found.
   */
  async get(
    compensationGroupId: string,
    timestamp: Date | null = null
  ): Promise<CompensationGroup | null> {
    let queryRef = query(
      this.compensationGroupsCollection(),
      where("id", "==", compensationGroupId)
    );

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
    return CompensationGroup.fromFirestoreDoc(docSnap.docs[0].data());
  }

  async delete(compGroup: CompensationGroup): Promise<boolean> {
    const usersQueryRef = query(
      this.salesUsersCollection(),
      where("compensationGroupId", "==", compGroup.id)
    );

    const docSnap = await getDocs(usersQueryRef);

    if (!docSnap.empty) {
      return false;
    }

    const compGroupsQueryRef = query(
      this.compensationGroupsCollection(),
      where("id", "==", compGroup.id)
    );

    const compGroupsQuerySnap = await getDocs(compGroupsQueryRef);

    const batch = writeBatch(this.db);

    for (const doc of compGroupsQuerySnap.docs) {
      batch.delete(doc.ref);
    }
    await batch.commit();
    return true;
  }

  /**
   * Retrieves all compensation groups from Firestore.
   * @returns An array of all compensation groups.
   */
  async getAll(): Promise<CompensationGroup[]> {
    const queryRef = query(
      this.compensationGroupsCollection(),
      orderBy("timestamp", "desc")
    );

    const compensationGroupQuerySnapshot = await getDocs(queryRef);

    const compensationGroups: CompensationGroup[] = [];
    const compensationGroupIds: Set<string> = new Set();

    compensationGroupQuerySnapshot.docs.forEach((doc) => {
      const compGroup = CompensationGroup.fromFirestoreDoc(doc.data());
      if (!compensationGroupIds.has(compGroup.id)) {
        compensationGroups.push(compGroup);
        compensationGroupIds.add(compGroup.id);
      }
    });

    return compensationGroups;
  }

  /**
   * Returns the reference to the "compensationGroups" collection in Firestore.
   * @returns The reference to the "compensationGroups" collection.
   */
  private compensationGroupsCollection(): CollectionReference {
    return collection(this.db, "compensationGroups");
  }

  private assignmentCodesCollection(): CollectionReference {
    return collection(this.db, "conversionAssignmentCodes");
  }

  private salesUsersCollection(): CollectionReference {
    return collection(this.db, "salesUsers");
  }
}
