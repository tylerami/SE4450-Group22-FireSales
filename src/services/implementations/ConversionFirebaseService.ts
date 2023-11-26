import { Conversion } from "models/Conversion";
import {
  UnassignedConversion,
  assignConversionsToUser,
} from "models/UnassignedConversion";
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

export class ConversionFirebaseService implements ConversionService {
  private db: Firestore;
  private imageService: ImageService;

  constructor(db: Firestore, imageService: ImageService) {
    this.db = db;
    this.imageService = imageService;
  }
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
    return querySnapshot.docs.map((doc) =>
      Conversion.fromFirestoreDoc(doc.data())
    );
  }
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
      this.unassignedConversionsCollection(),
      where("assignmentCode", "==", assignmentCode)
    );

    await this.setAssignmentCodeStatus(assignmentCode, true);

    const querySnapshot = await getDocs(queryRef);
    const unassignedConversions: UnassignedConversion[] =
      querySnapshot.docs.map((doc) =>
        UnassignedConversion.fromFirestoreDoc(doc.data())
      );

    const batch = writeBatch(this.db);

    const conversions: Conversion[] = assignConversionsToUser({
      unassignedConversions,
      userId,
    });

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
