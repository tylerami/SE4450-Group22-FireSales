import { AffiliateDeal } from "./AffiliateDeal";
import { ReferralLinkType } from "./enums/ReferralLinkType";
import { Timestamp, DocumentData } from "firebase/firestore";

export class Client {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  affiliateDeals: AffiliateDeal[];
  enabled: boolean;
  avgPaymentDays: number | null;

  constructor({
    id,
    name,
    createdAt = new Date(),
    updatedAt = null,
    affiliateDeals,
    enabled = true,
    avgPaymentDays = null,
  }: {
    id: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date | null;
    affiliateDeals?: AffiliateDeal[];
    enabled?: boolean;
    avgPaymentDays?: number | null;
  }) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.affiliateDeals = affiliateDeals ?? [];
    this.enabled = enabled;
    this.avgPaymentDays = avgPaymentDays;
  }

  public getDealsByType = (type: ReferralLinkType | null): AffiliateDeal[] =>
    this.affiliateDeals.filter((deal) => deal.type === type);

  public getSportsbookAffiliateDeal = (): AffiliateDeal | null =>
    this.affiliateDeals.find(
      (affiliateDeal) => affiliateDeal.type === ReferralLinkType.sports
    ) ?? null;
  public getCasinoAffiliateDeal = (): AffiliateDeal | null =>
    this.affiliateDeals.find(
      (affiliateDeal) => affiliateDeal.type === ReferralLinkType.casino
    ) ?? null;

  public hasSportsbookAffiliateDeal = (): boolean =>
    this.getSportsbookAffiliateDeal() !== null;
  public hasCasinoAffiliateDeal = (): boolean =>
    this.getCasinoAffiliateDeal() !== null;

  public addAffiliateDeal = (affiliateDeal: AffiliateDeal): void => {
    this.affiliateDeals.push(affiliateDeal);
  };

  public averageCpa = (): number => {
    if (this.affiliateDeals.length === 0) {
      return 0;
    }
    return (
      this.affiliateDeals.reduce((prev, deal) => prev + deal.cpa, 0) /
      this.affiliateDeals.length
    );
  };

  toFirestoreDoc(): DocumentData {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt ? Timestamp.fromDate(this.createdAt) : null,
      updatedAt: this.updatedAt ? Timestamp.fromDate(this.updatedAt) : null,
      affiliateDeals: this.affiliateDeals.map((deal) => deal.toFirestoreDoc()),
      enabled: this.enabled,
      avgPaymentDays: this.avgPaymentDays,
    };
  }

  static fromFirestoreDoc(doc: DocumentData): Client {
    return new Client({
      id: doc.id,
      name: doc.name,
      createdAt: doc.createdAt ? doc.createdAt.toDate() : new Date(),
      updatedAt: doc.updatedAt ? doc.updatedAt.toDate() : undefined,
      affiliateDeals: doc.affiliateDeals.map((docDeal) =>
        AffiliateDeal.fromFirestoreDoc(docDeal)
      ),
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
