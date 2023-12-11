import { Conversion } from "models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";
import {
  CollectionReference,
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { ImageService } from "services/interfaces/ImageService";

/**
 * Implementation of the ConversionService interface using Firebase Firestore.
 */
export class ConversionFirebaseService implements ConversionService {
  private db: Firestore;
  private imageService: ImageService;

  constructor(db: Firestore, imageService: ImageService) {
    this.db = db;
    this.imageService = imageService;
  }

  /**
   * Creates a new Conversion document in Firestore.
   * @param conversion The Conversion object to create.
   * @param attachments Optional array of File objects representing attachments.
   * @returns A Promise that resolves to the created Conversion object.
   */
  async create(
    conversion: Conversion,
    attachments: File[] = []
  ): Promise<Conversion> {
    const docRef = doc(this.conversionsCollection(), conversion.id);

    if (attachments) {
      conversion = await this.imageService.uploadConversionAttachments(
        conversion,
        attachments
      );
    }

    await setDoc(docRef, conversion.toFirestoreDoc());
    return conversion;
  }

  /**
   * Updates multiple Conversion documents in Firestore using a batch write.
   * @param conversions An array of Conversion objects to update.
   * @returns A Promise that resolves to the updated Conversion objects.
   */
  async updateBulk(conversions: Conversion[]): Promise<Conversion[]> {
    const batch = writeBatch(this.db);

    for (const conversion of conversions) {
      const docRef = doc(this.conversionsCollection(), conversion.id);
      try {
        batch.update(docRef, conversion.toFirestoreDoc());
      } catch (e) {
        console.log(e);
      }
    }
    try {
      await batch.commit();
    } catch (e) {
      console.log(e);
    }
    return conversions;
  }

  /**
   * Updates a single Conversion document in Firestore.
   * @param conversion The Conversion object to update.
   * @param newAttachments Optional array of File objects representing new attachments.
   * @returns A Promise that resolves to the updated Conversion object.
   */
  async update(
    conversion: Conversion,
    newAttachments: File[] = []
  ): Promise<Conversion> {
    const docRef = doc(this.conversionsCollection(), conversion.id);

    if (newAttachments) {
      conversion = await this.imageService.uploadConversionAttachments(
        conversion,
        newAttachments
      );
    }

    await setDoc(docRef, conversion.toFirestoreDoc());
    return conversion;
  }

  /**
   * Creates multiple Conversion documents in Firestore using a batch write.
   * @param items An array of objects containing a Conversion and optional attachments.
   * @returns A Promise that resolves to the created Conversion objects.
   */
  async createBulk(
    items: { conversion: Conversion; attachments?: File[] | undefined }[]
  ): Promise<Conversion[]> {
    const batch = writeBatch(this.db);
    const conversions: Conversion[] = [];

    for (let { conversion, attachments } of items) {
      const docRef = doc(this.conversionsCollection(), conversion.id);

      if (attachments) {
        conversion = await this.imageService.uploadConversionAttachments(
          conversion,
          attachments
        );
      }

      batch.set(docRef, conversion.toFirestoreDoc());
      conversions.push(conversion);
    }

    await batch.commit();

    // Set assignment codes as used
    const assignmentCodes: Set<string> = new Set();
    for (const conversion of conversions) {
      if (!conversion.userId && conversion.assignmentCode) {
        assignmentCodes.add(conversion.assignmentCode);
      }
    }

    this.setAssignmentCodeStatusBulk(Array.from(assignmentCodes), false);

    return conversions;
  }

  /**
   * Queries Conversion documents in Firestore based on specified criteria.
   * @param userId The user ID to filter by.
   * @param clientId The client ID to filter by.
   * @param startDate The start date to filter by.
   * @param endDate The end date to filter by.
   * @param minAmount The minimum amount to filter by.
   * @param maxAmount The maximum amount to filter by.
   * @param minCommission The minimum commission to filter by.
   * @param maxCommission The maximum commission to filter by.
   * @param compensationGroupId The compensation group ID to filter by.
   * @param referralLinkType The referral link type to filter by.
   * @param includeUnasigned Whether to include unassigned conversions in the result.
   * @returns A Promise that resolves to an array of Conversion objects.
   */
  async query({
    userId,
    clientId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    minCommission,
    maxCommission,
    compensationGroupId,
    referralLinkType,
    includeUnasigned = true,
  }: {
    userId?: string;
    clientId?: string;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    minCommission?: number;
    maxCommission?: number;
    compensationGroupId?: string;
    referralLinkType?: string;
    includeUnasigned: boolean;
  }): Promise<Conversion[]> {
    let queryRef = query(this.conversionsCollection());

    // Use date as inequality filter for maximum search performance
    if (startDate) {
      queryRef = query(queryRef, where("dateOccurred", ">=", startDate));
    }

    if (endDate) {
      queryRef = query(queryRef, where("dateOccurred", "<=", endDate));
    }

    // Use other filters as equality filters
    if (userId) {
      queryRef = query(queryRef, where("userId", "==", userId));
    }

    if (clientId) {
      queryRef = query(queryRef, where("clientId", "==", clientId));
    }

    if (compensationGroupId) {
      queryRef = query(
        queryRef,
        where("compensationGroupId", "==", compensationGroupId)
      );
    }

    queryRef = query(queryRef, orderBy("dateOccurred", "desc"));

    const querySnapshot = await getDocs(queryRef);
    let conversions = querySnapshot.docs.map((doc) =>
      Conversion.fromFirestoreDoc(doc.data())
    );

    console.log("found conversions", conversions.length, startDate);

    // Apply additional filters
    conversions = conversions.filter((conversion) => {
      if (minAmount && conversion.amount < minAmount) {
        return false;
      }

      if (maxAmount && conversion.amount > maxAmount) {
        return false;
      }

      if (
        minCommission &&
        conversion.affiliateLink.commission < minCommission
      ) {
        return false;
      }

      if (
        maxCommission &&
        conversion.affiliateLink.commission > maxCommission
      ) {
        return false;
      }

      if (!includeUnasigned && !conversion.userId) {
        return false;
      }

      if (
        referralLinkType &&
        conversion.affiliateLink.type !== referralLinkType
      ) {
        return false;
      }

      return true;
    });

    return conversions;
  }

  /**
   * Checks if an assignment code is valid.
   * @param code The assignment code to check.
   * @returns A Promise that resolves to a boolean indicating if the code is valid.
   */
  async isAssignmentCodeValid(code: string): Promise<boolean> {
    const docRef = doc(this.assignmentCodesCollection(), code);
    const docSnapshot = await getDoc(docRef);
    const docData = docSnapshot.data();
    return docData?.used === false;
  }

  async assignConversionsWithCode({
    assignmentCode,
    userId,
  }: {
    assignmentCode: string;
    userId: string;
  }): Promise<Conversion[]> {
    const queryRef = query(
      this.conversionsCollection(),
      where("assignmentCode", "==", assignmentCode)
    );

    const querySnapshot = await getDocs(queryRef);
    const conversions = querySnapshot.docs.map((doc) =>
      Conversion.fromFirestoreDoc(doc.data())
    );

    const batch = writeBatch(this.db);

    for (const conversion of conversions) {
      const docRef = doc(this.conversionsCollection(), conversion.id);
      batch.update(docRef, { userId });
    }

    const result = await batch.commit();
    console.log(result);
    await this.setAssignmentCodeStatus(assignmentCode, true);
    return conversions;
  }

  private async setAssignmentCodeStatusBulk(
    assignmentCodes: string[],
    used: boolean
  ): Promise<void> {
    const batch = writeBatch(this.db);

    for (const assignmentCode of assignmentCodes) {
      const docRef = doc(this.assignmentCodesCollection(), assignmentCode);
      batch.set(docRef, { used, id: assignmentCode });
    }

    await batch.commit();
  }

  private async setAssignmentCodeStatus(
    assignmentCode: string,
    used: boolean
  ): Promise<void> {
    const docRef = doc(this.assignmentCodesCollection(), assignmentCode);
    return setDoc(docRef, { id: assignmentCode, used });
  }

  private assignmentCodesCollection(): CollectionReference {
    return collection(this.db, "conversionAssignmentCodes");
  }

  private conversionsCollection(): CollectionReference {
    return collection(this.db, "conversions");
  }
}
