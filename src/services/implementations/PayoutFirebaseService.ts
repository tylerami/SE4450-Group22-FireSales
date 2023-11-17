import { Payout } from "models/Payout";
import {
  CollectionReference,
  Firestore,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { PayoutService } from "services/interfaces/PayoutService";

export class PayoutFirebaseService implements PayoutService {
  private db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async create(payout: Payout): Promise<Payout> {
    const docRef = doc(this.payoutsCollection(), payout.id);
    await setDoc(docRef, payout.toFirestoreDoc());
    return payout;
  }
  async query({
    userId,
    amountMin,
    amountMax,
    dateStart,
    dateEnd,
    paymentMethod,
  }: {
    userId?: string | undefined;
    amountMin?: number | undefined;
    amountMax?: number | undefined;
    dateStart?: Date | undefined;
    dateEnd?: Date | undefined;
    paymentMethod?: string | undefined;
  }): Promise<Payout[]> {
    let payoutQuery = query(this.payoutsCollection());
    // this likely requires an index
    if (userId) {
      payoutQuery = query(payoutQuery, where("userId", "==", userId));
    }
    if (amountMin) {
      payoutQuery = query(payoutQuery, where("amount", ">=", amountMin));
    }
    if (amountMax) {
      payoutQuery = query(payoutQuery, where("amount", "<=", amountMax));
    }
    if (dateStart) {
      payoutQuery = query(payoutQuery, where("dateOccurred", ">=", dateStart));
    }
    if (dateEnd) {
      payoutQuery = query(payoutQuery, where("dateOccurred", "<=", dateEnd));
    }
    if (paymentMethod) {
      payoutQuery = query(
        payoutQuery,
        where("paymentMethod", "==", paymentMethod)
      );
    }
    const payoutDocs = await getDocs(payoutQuery);
    const payouts: Payout[] = payoutDocs.docs.map((doc) =>
      Payout.fromFirestoreDoc(doc.data())
    );
    // sort by dateOccurred chronologically
    payouts.sort((a, b) => a.dateOccurred.getTime() - b.dateOccurred.getTime());
    return payouts;
  }

  private payoutsCollection(): CollectionReference {
    return collection(this.db, "payouts");
  }
}
