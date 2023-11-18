import { Currency } from "./enums/Currency";
import { ReferralLinkType } from "./enums/ReferralLinkType";
import { Timestamp, DocumentData } from "firebase/firestore";

export class AffiliateDeal {
  clientId: string;
  clientName: string;
  type: ReferralLinkType | null;
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
    type: ReferralLinkType | null;
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

  toFirestoreDoc(): DocumentData {
    return {
      clientId: this.clientId,
      clientName: this.clientName,
      type: this.type,
      link: this.link,
      enabled: this.enabled,
      createdAt: this.createdAt ? Timestamp.fromDate(this.createdAt) : null,
      updatedAt: this.updatedAt ? Timestamp.fromDate(this.updatedAt) : null,
      cpa: this.cpa,
      currency: this.currency,
      targetBetSize: this.targetBetSize,
      targetMonthlyConversions: this.targetMonthlyConversions,
    };
  }

  static fromFirestoreDoc(doc: DocumentData): AffiliateDeal {
    return new AffiliateDeal({
      clientId: doc.clientId,
      clientName: doc.clientName,
      type: doc.type as ReferralLinkType | null,
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

  static fromPartial(
    partial: Partial<AffiliateDeal>,
    { clientName, clientId }: { clientName?: string; clientId?: string } = {}
  ): AffiliateDeal | null {
    partial.clientId = clientId ?? partial.clientId;
    partial.clientName = clientName ?? partial.clientName;
    if (
      !partial.clientId ||
      !partial.clientName ||
      partial.type === undefined ||
      !partial.link ||
      !partial.cpa
    ) {
      console.log("Invalid partial AffiliateDeal:", partial);
      console.log("Missing required fields", {
        clientId: !partial.clientId,
        clientName: !partial.clientName,
        type: !partial.type,
        link: !partial.link,
        cpa: !partial.cpa,
      });
      return null;
    }
    return new AffiliateDeal({
      clientId: partial.clientId,
      clientName: partial.clientName,
      type: partial.type,
      link: partial.link,
      enabled: partial.enabled,
      createdAt: partial.createdAt,
      updatedAt: partial.updatedAt,
      cpa: partial.cpa,
      currency: partial.currency,
      targetBetSize: partial.targetBetSize,
      targetMonthlyConversions: partial.targetMonthlyConversions,
    });
  }
}
