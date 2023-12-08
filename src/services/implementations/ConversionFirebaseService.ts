import { Conversion } from "models/Conversion";
import { UnassignedConversion } from "models/UnassignedConversion";
import { ConversionService } from "services/interfaces/ConversionService";
import {
  CollectionReference,
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
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
    includeUnasigned = false,
  }: {
    userId?: string | undefined;
    clientId?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    minAmount?: number | undefined;
    maxAmount?: number | undefined;
    minCommission?: number | undefined;
    maxCommission?: number | undefined;
    compensationGroupId?: string | undefined;
    referralLinkType?: string | undefined;
    includeUnasigned: boolean;
  }): Promise<Conversion[]> {
    let queryRef = query(this.conversionsCollection());

    if (userId) {
      queryRef = query(queryRef, where("userId", "==", userId));
    }

    if (clientId) {
      queryRef = query(queryRef, where("clientId", "==", clientId));
    }

    if (startDate) {
      queryRef = query(queryRef, where("date", ">=", startDate));
    }

    if (endDate) {
      queryRef = query(queryRef, where("date", "<=", endDate));
    }

    if (minAmount) {
      queryRef = query(queryRef, where("amount", ">=", minAmount));
    }

    if (maxAmount) {
      queryRef = query(queryRef, where("amount", "<=", maxAmount));
    }

    if (minCommission) {
      queryRef = query(queryRef, where("commission", ">=", minCommission));
    }

    if (maxCommission) {
      queryRef = query(queryRef, where("commission", "<=", maxCommission));
    }

    if (compensationGroupId) {
      queryRef = query(
        queryRef,
        where("compensationGroupId", "==", compensationGroupId)
      );
    }

    if (referralLinkType) {
      queryRef = query(
        queryRef,
        where("referralLinkType", "==", referralLinkType)
      );
    }

    const querySnapshot = await getDocs(queryRef);
    const assignedConversions = querySnapshot.docs.map((doc) =>
      Conversion.fromFirestoreDoc(doc.data())
    );

    let unassignedConversions: UnassignedConversion[] = [];
    if (includeUnasigned) {
      unassignedConversions = await this.queryUnassigned({});
    }

    return [
      ...unassignedConversions.map((unassignedConv) =>
        unassignedConv.asConversionWithoutAssignment()
      ),
      ...assignedConversions,
    ];
  }

  /**
   * Creates multiple UnassignedConversion documents in Firestore using a batch write.
   * @param items An array of objects containing an UnassignedConversion and optional attachments.
   * @returns A Promise that resolves to the created UnassignedConversion objects.
   */
  async createBulkUnassigned(
    items: {
      conversion: UnassignedConversion;
      attachments?: File[] | undefined;
    }[]
  ): Promise<UnassignedConversion[]> {
    const batch = writeBatch(this.db);
    const conversions: UnassignedConversion[] = [];

    // establish assignment codes
    const assignmentCodes: string[] = Array.from(
      new Set(items.map((item) => item.conversion.assignmentCode))
    );

    for (const assignmentCode of assignmentCodes) {
      await this.setAssignmentCodeStatus(assignmentCode, false);
    }

    // create unassigned conversions

    for (let { conversion: unassignedConv, attachments } of items) {
      const docRef = doc(
        this.unassignedConversionsCollection(),
        unassignedConv.id
      );

      if (attachments) {
        unassignedConv =
          await this.imageService.uploadUnassignedConversionAttachments(
            unassignedConv,
            attachments
          );
      }

      batch.set(docRef, unassignedConv.toFirestoreDoc());
      conversions.push(unassignedConv);
    }

    await batch.commit();
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

  /**
   * Queries UnassignedConversion documents in Firestore based on specified criteria.
   * @param assignmentCode The assignment code to filter by.
   * @returns A Promise that resolves to an array of UnassignedConversion objects.
   */
  async queryUnassigned({ assignmentCode }: { assignmentCode?: string }) {
    let queryRef = query(this.unassignedConversionsCollection());
    if (assignmentCode) {
      queryRef = query(queryRef, where("assignmentCode", "==", assignmentCode));
    }

    const querySnapshot = await getDocs(queryRef);
    return querySnapshot.docs.map((doc) =>
      UnassignedConversion.fromFirestoreDoc(doc.data())
    );
  }

  /**
   * Assigns UnassignedConversion documents to a user based on an assignment code.
   * @param assignmentCode The assignment code to filter by.
   * @param userId The user ID to assign the conversions to.
   * @returns A Promise that resolves to an array of Conversion objects.
   */
  async assignConversionsWithCode({
    assignmentCode,
    userId,
  }: {
    assignmentCode: string;
    userId: string;
  }): Promise<Conversion[]> {
    const unassignedConversions: UnassignedConversion[] =
      await this.queryUnassigned({ assignmentCode });

    await this.setAssignmentCodeStatus(assignmentCode, true);

    const batch = writeBatch(this.db);

    const conversions: Conversion[] = unassignedConversions.map(
      (unassignedConv) => unassignedConv.assignToUser(userId)
    );

    for (const conversion of conversions) {
      const docRef = doc(this.conversionsCollection(), conversion.id);
      batch.set(docRef, conversion.toFirestoreDoc());
    }

    await batch.commit();

    return conversions;
  }

  private setAssignmentCodeStatus(
    assignmentCode: string,
    status: boolean
  ): Promise<void> {
    const docRef = doc(this.assignmentCodesCollection(), assignmentCode);
    return setDoc(docRef, { id: assignmentCode, used: status });
  }

  private assignmentCodesCollection(): CollectionReference {
    return collection(this.db, "conversionAssignmentCodes");
  }

  private conversionsCollection(): CollectionReference {
    return collection(this.db, "conversions");
  }

  private unassignedConversionsCollection(): CollectionReference {
    return collection(this.db, "unassignedConversions");
  }
}
