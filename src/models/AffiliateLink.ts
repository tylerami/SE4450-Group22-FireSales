import {
  ReferralLinkType,
  getReferralLinkTypeLabel,
} from "./enums/ReferralLinkType";
import { Timestamp, DocumentData } from "firebase/firestore";

export class AffiliateLink {
  clientId: string;
  clientName: string;
  type: ReferralLinkType;
  link: string;
  enabled: boolean;
  createdAt: Date;
  commission: number;
  minBetSize: number;
  cpa: number;

  constructor({
    clientId,
    clientName,
    type,
    link,
    enabled = true,
    createdAt = new Date(),
    commission,
    minBetSize,
    cpa,
  }: {
    clientId: string;
    clientName: string;
    type: ReferralLinkType;
    link: string;
    enabled?: boolean;
    createdAt?: Date;
    commission: number;
    minBetSize: number;
    cpa: number;
  }) {
    this.clientId = clientId;
    this.clientName = clientName;
    this.type = type;
    this.link = link;
    this.enabled = enabled;
    this.createdAt = createdAt;
    this.commission = commission;
    this.minBetSize = minBetSize;
    this.cpa = cpa;
  }

  public description(): string {
    return `${this.clientName} - ${getReferralLinkTypeLabel(this.type)}`;
  }

  public toFirestoreDoc(): DocumentData {
    return {
      clientId: this.clientId,
      clientName: this.clientName,
      type: this.type,
      link: this.link,
      enabled: this.enabled,
      createdAt: this.createdAt ? Timestamp.fromDate(this.createdAt) : null,
      commission: this.commission,
      minBetSize: this.minBetSize,
      cpa: this.cpa,
    };
  }

  public static fromFirestoreDoc(doc: DocumentData): AffiliateLink {
    return new AffiliateLink({
      clientId: doc.clientId,
      clientName: doc.clientName,
      type: doc.type as ReferralLinkType,
      link: doc.link,
      enabled: doc.enabled,
      createdAt: doc.createdAt ? doc.createdAt.toDate() : new Date(),
      commission: doc.commission,
      minBetSize: doc.minBetSize,
      cpa: doc.cpa,
    });
  }
}
