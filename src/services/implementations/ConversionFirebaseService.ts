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
    { attachments }: { attachments?: File[] | undefined }
  ): Promise<Conversion> {
    const docRef = doc(this.conversionsCollection(), conversion.id);

    if (attachments) {
      const userId = conversion.userId;
      const path = `/conversions/${userId}/${conversion.id}`;

      conversion.attachmentUrls = (
        await this.imageService.bulkUploadImages(path, attachments)
      ).map((item) => item.url);
    }

    await setDoc(docRef, conversion.toFirestoreDoc());
    return conversion;
  }

  async createBulk(
    items: { conversion: Conversion; attachments?: File[] | undefined }[]
  ): Promise<Conversion[]> {
    const batch = writeBatch(this.db);
    const conversions: Conversion[] = [];

    for (const { conversion, attachments } of items) {
      const docRef = doc(this.conversionsCollection(), conversion.id);

      if (attachments) {
        const userId = conversion.userId;
        const path = `/conversions/${userId}/${conversion.id}`;

        conversion.attachmentUrls = (
          await this.imageService.bulkUploadImages(path, attachments)
        ).map((item) => item.url);
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

    for (const { conversion, attachments } of items) {
      const docRef = doc(this.unassignedConversionsCollection(), conversion.id);

      if (attachments) {
        const path = `/conversions/unassigned/${conversion.assignmentCode}/${conversion.id}`;

        conversion.attachmentUrls = (
          await this.imageService.bulkUploadImages(path, attachments)
        ).map((item) => item.url);
      }

      batch.set(docRef, conversion.toFirestoreDoc());
      conversions.push(conversion);
    }

    await batch.commit();
    return conversions;
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

  private conversionsCollection(): CollectionReference {
    return collection(this.db, "conversions");
  }

  private unassignedConversionsCollection(): CollectionReference {
    return collection(this.db, "unassignedConversions");
  }
}
