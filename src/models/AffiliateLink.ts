import { ReferralLinkType } from "./enums/ReferralLinkType";

export class AffiliateLink {
  clientId: string;
  type: ReferralLinkType;
  link: string;
  enabled: boolean;
  createdAt: Date;
  commission: number;
  minBetSize: number;

  constructor({
    clientId,
    type,
    link,
    enabled = true,
    createdAt = new Date(),
    commission,
    minBetSize,
  }: {
    clientId: string;
    type: ReferralLinkType;
    link: string;
    enabled?: boolean;
    createdAt?: Date;
    commission: number;
    minBetSize: number;
  }) {
    this.clientId = clientId;
    this.type = type;
    this.link = link;
    this.enabled = enabled;
    this.createdAt = createdAt;
    this.commission = commission;
    this.minBetSize = minBetSize;
  }
}
