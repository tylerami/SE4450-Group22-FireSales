import { AffiliateLink } from "./AffiliateLink";
import RetentionIncentive from "./RetentionIncentive";
import { ConversionType } from "./enums/ConversionType";
import { Currency } from "./enums/Currency";
import { Timestamp, DocumentData } from "firebase/firestore";

export const ADMIN_COMP_GROUP_ID = "ADMIN";

export class CompensationGroup {
  id: string;
  affiliateLinks: AffiliateLink[];
  retentionIncentives: RetentionIncentive[];
  timestamp: Date;
  enabled: boolean;
  currency: Currency;

  constructor({
    id,
    affiliateLinks = [],
    retentionIncentives = [],
    timestamp,
    enabled = true,
    currency = Currency.CAD,
  }: {
    id: string;
    affiliateLinks?: AffiliateLink[];
    retentionIncentives?: RetentionIncentive[];
    timestamp: Date;
    enabled: boolean;
    currency?: Currency;
  }) {
    this.id = id;
    this.affiliateLinks = affiliateLinks;
    this.retentionIncentives = retentionIncentives;
    this.timestamp = timestamp;
    this.enabled = enabled;
    this.currency = currency;
  }

  public firestoreDocId(): string {
    return `${this.id}_${this.timestamp.toISOString()}`;
  }

  public clientIds(): string[] {
    return this.affiliateLinks.map((link) => link.clientId);
  }

  public retentionIncentiveForClient(
    clientId: string
  ): RetentionIncentive | undefined {
    return this.retentionIncentives.find(
      (incentive) => incentive.clientId === clientId
    );
  }

  public conversionTypesForClient(clientId: string): ConversionType[] {
    const affiliateLinks = this.affiliateLinks.filter(
      (link) => link.clientId === clientId
    );
    const retentionIncentives = this.retentionIncentives.filter(
      (incentive) => incentive.clientId === clientId
    );

    const conversionTypes: Set<ConversionType> = new Set();
    for (const link of affiliateLinks) {
      link.conversionTypes.forEach((type) => conversionTypes.add(type));
    }

    if (retentionIncentives.length > 0) {
      conversionTypes.add(ConversionType.retentionIncentive);
    }

    return Array.from(conversionTypes);
  }

  public toFirestoreDoc(): DocumentData {
    const affiliateLinksForFirestore = this.affiliateLinks.map((link) =>
      link.toFirestoreDoc()
    );

    const retentionIncentivesForFirestore = this.retentionIncentives?.map(
      (incentive) => incentive.toFirestoreDoc()
    );

    return {
      id: this.id,
      affiliateLinks: affiliateLinksForFirestore,
      retentionIncentives: retentionIncentivesForFirestore,
      timestamp: Timestamp.fromDate(this.timestamp),
      enabled: this.enabled,
      currency: this.currency,
    };
  }

  public static fromFirestoreDoc(doc: DocumentData): CompensationGroup {
    const affiliateLinksFromFirestore = doc.affiliateLinks.map(
      (linkDoc: DocumentData) => AffiliateLink.fromFirestoreDoc(linkDoc)
    );

    const retentionIncentivesFromFirestore = doc.retentionIncentives?.map(
      (incentiveDoc: DocumentData) =>
        RetentionIncentive.fromFirestoreDoc(incentiveDoc)
    );

    return new CompensationGroup({
      id: doc.id,
      affiliateLinks: affiliateLinksFromFirestore,
      retentionIncentives: retentionIncentivesFromFirestore,
      timestamp: doc.timestamp.toDate(),
      enabled: doc.enabled,
      currency: doc.currency as Currency,
    });
  }
}

export function validVersionAtTime(
  compGroupHistory: CompensationGroup[],
  timestamp: Date
): CompensationGroup | null {
  compGroupHistory.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  for (const groupVersion of compGroupHistory) {
    if (groupVersion.timestamp.getTime() <= timestamp.getTime()) {
      return groupVersion;
    }
  }

  return null;
}
