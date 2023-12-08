import { AffiliateLink } from "./AffiliateLink";
import { Currency } from "./enums/Currency";
import { Timestamp, DocumentData } from "firebase/firestore";

export class CompensationGroup {
  id: string;
  affiliateLinks: AffiliateLink[];
  timestamp: Date;
  enabled: boolean;
  currency: Currency;

  constructor({
    id,
    affiliateLinks = [],
    timestamp = new Date(),
    enabled = true,
    currency = Currency.CAD,
  }: {
    id: string;
    affiliateLinks?: AffiliateLink[];
    timestamp?: Date;
    enabled: boolean;
    currency?: Currency;
  }) {
    this.id = id;
    this.affiliateLinks = affiliateLinks;
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

  public toFirestoreDoc(): DocumentData {
    const affiliateLinksForFirestore = this.affiliateLinks.map((link) =>
      link.toFirestoreDoc()
    );

    return {
      id: this.id,
      affiliateLinks: affiliateLinksForFirestore,
      timestamp: this.timestamp ? Timestamp.fromDate(this.timestamp) : null,
      enabled: this.enabled,
      currency: this.currency,
    };
  }

  public static fromFirestoreDoc(doc: DocumentData): CompensationGroup {
    const affiliateLinksFromFirestore = doc.affiliateLinks.map(
      (linkDoc: DocumentData) => AffiliateLink.fromFirestoreDoc(linkDoc)
    );

    return new CompensationGroup({
      id: doc.id,
      affiliateLinks: affiliateLinksFromFirestore,
      timestamp: doc.createdAt ? doc.createdAt.toDate() : new Date(),
      enabled: doc.enabled,
      currency: doc.currency as Currency,
    });
  }
}
