import { Currency } from "./enums/Currency";
import { ReferralLinkType } from "./enums/ReferralLinkType";
import { Timestamp, DocumentData } from "firebase/firestore";

export class AffiliateDeal {
  clientId: string;
  clientName: string;
  type: ReferralLinkType;
  link: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt?: Date;
  cpa: number;
  currency: Currency;
  targetBetSize?: number;
  targetMonthlyConversions?: number;

  constructor({
    clientId,
    clientName,
    type,
    link,
    enabled = true,
    createdAt = new Date(),
    updatedAt,
    cpa,
    currency = Currency.CAD,
    targetBetSize,
    targetMonthlyConversions,
  }: {
    clientId: string;
    clientName: string;
    type: ReferralLinkType;
    link: string;
    enabled?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    cpa: number;
    currency?: Currency;
    targetBetSize?: number;
    targetMonthlyConversions?: number;
  }) {
    this.clientId = clientId;
    this.clientName = clientName;
    this.type = type;
    this.link = link;
    this.enabled = enabled;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.cpa = cpa;
    this.currency = currency;
    this.targetBetSize = targetBetSize;
    this.targetMonthlyConversions = targetMonthlyConversions;
  }

  toFirestoreDoc(affiliateDeal: AffiliateDeal): DocumentData {
    return {
      clientId: affiliateDeal.clientId,
      clientName: affiliateDeal.clientName,
      type: affiliateDeal.type,
      link: affiliateDeal.link,
      enabled: affiliateDeal.enabled,
      createdAt: affiliateDeal.createdAt
        ? Timestamp.fromDate(affiliateDeal.createdAt)
        : null,
      updatedAt: affiliateDeal.updatedAt
        ? Timestamp.fromDate(affiliateDeal.updatedAt)
        : null,
      cpa: affiliateDeal.cpa,
      currency: affiliateDeal.currency,
      targetBetSize: affiliateDeal.targetBetSize,
      targetMonthlyConversions: affiliateDeal.targetMonthlyConversions,
    };
  }

  static fromFirestoreDoc(doc: DocumentData): AffiliateDeal {
    return new AffiliateDeal({
      clientId: doc.clientId,
      clientName: doc.clientName,
      type: doc.type as ReferralLinkType,
      link: doc.link,
      enabled: doc.enabled,
      createdAt: doc.createdAt ? doc.createdAt.toDate() : new Date(),
      updatedAt: doc.updatedAt ? doc.updatedAt.toDate() : undefined,
      cpa: doc.cpa,
      currency: doc.currency as Currency,
      targetBetSize: doc.targetBetSize,
      targetMonthlyConversions: doc.targetMonthlyConversions,
    });
  }
}
