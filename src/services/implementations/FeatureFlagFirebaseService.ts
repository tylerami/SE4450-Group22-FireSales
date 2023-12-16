import {
  DocumentData,
  DocumentReference,
  Firestore,
  collection,
  doc,
  getDoc,
} from "firebase/firestore";
import FeatureFlagService from "services/interfaces/FeatureFlagService";

class FeatureFlagFirebaseService implements FeatureFlagService {
  private db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async getFlagValue<T>(flagName: string): Promise<T | null> {
    const docRef = this.featureFlagsDocumentReference();
    const docSnapshot = await getDoc(docRef);
    const flags: DocumentData | undefined = docSnapshot.data();
    if (!flags) {
      return null;
    }

    const flagValue: any = flags[flagName];
    if (!flagValue) {
      return null;
    }
    return flagValue as T;
  }

  private featureFlagsDocumentReference(): DocumentReference {
    return doc(collection(this.db, "control"), "affiliatesPlatformFlags");
  }
}

export default FeatureFlagFirebaseService;
