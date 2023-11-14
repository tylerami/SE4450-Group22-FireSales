import { AffiliateLink } from "./AffiliateLink";
import { Currency } from "./enums/Currency";
import { Timestamp, DocumentData } from "firebase/firestore";

export class CompensationGroup {
  id: string;
  // this should be consistent with the AffiliateDealContainer in Client
  affiliateLinks: AffiliateLink[];
  createdAt: Date;
  updatedAt?: Date;
  enabled: boolean;
  currency: Currency;

  constructor({
    id,
    affiliateLinks = [],
    createdAt = new Date(),
    updatedAt,
    enabled = true,
    currency = Currency.CAD,
  }: {
    id: string;
    affiliateLinks?: AffiliateLink[];
    createdAt?: Date;
    updatedAt?: Date;
    enabled: boolean;
    currency?: Currency;
  }) {
    this.id = id;
    this.affiliateLinks = affiliateLinks;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.enabled = enabled;
    this.currency = currency;
  }

  public toFirestoreDoc(): DocumentData {
    const affiliateLinksForFirestore = this.affiliateLinks.map((link) =>
      link.toFirestoreDoc()
    );

    return {
      id: this.id,
      affiliateLinks: affiliateLinksForFirestore,
      createdAt: this.createdAt ? Timestamp.fromDate(this.createdAt) : null,
      updatedAt: this.updatedAt ? Timestamp.fromDate(this.updatedAt) : null,
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
      createdAt: doc.createdAt ? doc.createdAt.toDate() : new Date(),
      updatedAt: doc.updatedAt ? doc.updatedAt.toDate() : undefined,
      enabled: doc.enabled,
      currency: doc.currency as Currency,
    });
  }
}
