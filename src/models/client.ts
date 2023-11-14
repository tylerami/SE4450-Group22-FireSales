import { AffiliateDeal } from "./AffiliateDeal";
import { ReferralLinkType } from "./enums/ReferralLinkType";
import { Timestamp, DocumentData } from "firebase/firestore";

export type AffiliateDealContainer = {
  [key in ReferralLinkType]?: AffiliateDeal | undefined;
};

export class Client {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
  affiliateDeals: AffiliateDealContainer;
  enabled: boolean;
  avgPaymentDays?: number;

  constructor({
    id,
    name,
    createdAt = new Date(),
    updatedAt,
    affiliateDeals,
    enabled = true,
    avgPaymentDays,
  }: {
    id: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    affiliateDeals?: AffiliateDealContainer;
    enabled?: boolean;
    avgPaymentDays?: number;
  }) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.affiliateDeals = affiliateDeals || {};
    this.enabled = enabled;
    this.avgPaymentDays = avgPaymentDays;
  }

  public hasSportsbookAffiliateDeal = () =>
    this.affiliateDeals[ReferralLinkType.sports] !== undefined;
  public hasCasinoAffiliateDeal = () =>
    this.affiliateDeals[ReferralLinkType.casino] !== undefined;
  public hasCasinoAndSportsAffiliateDeal = () =>
    this.affiliateDeals[ReferralLinkType.casinoAndSports] !== undefined;

  public getSportsbookAffiliateDeal = () =>
    this.affiliateDeals[ReferralLinkType.sports];
  public getCasinoAffiliateDeal = () =>
    this.affiliateDeals[ReferralLinkType.casino];
  public getCasinoAndSportsAffiliateDeal = () =>
    this.affiliateDeals[ReferralLinkType.casinoAndSports];

  public setSportsbookAffiliateDeal = (affiliateDeal: AffiliateDeal | null) => {
    if (affiliateDeal === null) {
      delete this.affiliateDeals[ReferralLinkType.sports];
    }
    this.affiliateDeals[ReferralLinkType.sports] =
      affiliateDeal as AffiliateDeal;
  };
  public setCasinoAffiliateDeal = (affiliateDeal: AffiliateDeal | null) => {
    if (affiliateDeal === null) {
      delete this.affiliateDeals[ReferralLinkType.casino];
    }
    this.affiliateDeals[ReferralLinkType.casino] =
      affiliateDeal as AffiliateDeal;
  };
  public setCasinoAndSportsAffiliateDeal = (
    affiliateDeal: AffiliateDeal | null
  ) => {
    if (affiliateDeal === null) {
      delete this.affiliateDeals[ReferralLinkType.casinoAndSports];
    }
    this.affiliateDeals[ReferralLinkType.casinoAndSports] =
      affiliateDeal as AffiliateDeal;
  };

  toFirestoreDoc(): DocumentData {
    const affiliateDealsForFirestore = {};
    Object.keys(this.affiliateDeals).forEach((key) => {
      affiliateDealsForFirestore[key] =
        this.affiliateDeals[key].toFirestoreDoc();
    });

    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt ? Timestamp.fromDate(this.createdAt) : null,
      updatedAt: this.updatedAt ? Timestamp.fromDate(this.updatedAt) : null,
      affiliateDeals: affiliateDealsForFirestore,
      enabled: this.enabled,
      avgPaymentDays: this.avgPaymentDays,
    };
  }

  static fromFirestoreDoc(doc: DocumentData): Client {
    const affiliateDealsFromFirestore = {};
    if (doc.affiliateDeals) {
      Object.keys(doc.affiliateDeals).forEach((key) => {
        affiliateDealsFromFirestore[key] = AffiliateDeal.fromFirestoreDoc(
          doc.affiliateDeals[key]
        );
      });
    }

    return new Client({
      id: doc.id,
      name: doc.name,
      createdAt: doc.createdAt ? doc.createdAt.toDate() : new Date(),
      updatedAt: doc.updatedAt ? doc.updatedAt.toDate() : undefined,
      affiliateDeals: affiliateDealsFromFirestore,
      enabled: doc.enabled,
      avgPaymentDays: doc.avgPaymentDays,
    });
  }
}

export function getAllAffiliateDeals(clients: Client[]): AffiliateDeal[] {
  return clients.reduce((acc: AffiliateDeal[], client: Client) => {
    return [...acc, ...Object.values(client.affiliateDeals)];
  }, []);
}
