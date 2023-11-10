import { get } from "http";
import {
  ReferralLinkType,
  getReferralLinkTypeLabel,
} from "./enums/ReferralLinkType";

export class AffiliateLink {
  clientId: string;
  clientName: string;
  type: ReferralLinkType;
  link: string;
  enabled: boolean;
  createdAt: Date;
  commission: number;
  minBetSize: number;

  constructor({
    clientId,
    clientName,
    type,
    link,
    enabled = true,
    createdAt = new Date(),
    commission,
    minBetSize,
  }: {
    clientId: string;
    clientName: string;
    type: ReferralLinkType;
    link: string;
    enabled?: boolean;
    createdAt?: Date;
    commission: number;
    minBetSize: number;
  }) {
    this.clientId = clientId;
    this.clientName = clientName;
    this.type = type;
    this.link = link;
    this.enabled = enabled;
    this.createdAt = createdAt;
    this.commission = commission;
    this.minBetSize = minBetSize;
  }

  public description(): string {
    return `${this.clientName} - ${getReferralLinkTypeLabel(this.type)}`;
  }
}
