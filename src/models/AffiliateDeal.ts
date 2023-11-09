import { Currency } from "./enums/Currency";
import { ReferralLinkType } from "./enums/ReferralLinkType";

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
  minBetSize: number;
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
    minBetSize,
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
    minBetSize: number;
    targetMonthlyConversions: number;
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
    this.minBetSize = minBetSize;
    this.targetMonthlyConversions = targetMonthlyConversions;
  }
}
