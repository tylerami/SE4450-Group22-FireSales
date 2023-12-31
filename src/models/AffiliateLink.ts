import { ConversionType } from "./enums/ConversionType";
import {
  ReferralLinkType,
  getReferralLinkTypeLabel,
} from "./enums/ReferralLinkType";
import { Timestamp, DocumentData } from "firebase/firestore";

export class AffiliateLink {
  clientId: string;
  clientName: string;
  type: ReferralLinkType | null;
  link: string;
  betMatchEnabled: boolean;
  enabled: boolean;
  createdAt: Date;
  commission: number;
  minBetSize: number;
  cpa: number;
  monthlyLimit: number | null;

  constructor({
    clientId,
    clientName,
    type,
    betMatchEnabled = false,

    link,
    enabled = true,
    createdAt = new Date(),
    commission,
    minBetSize,
    cpa,
    monthlyLimit = null,
  }: {
    clientId: string;
    clientName: string;
    type: ReferralLinkType | null;
    betMatchEnabled?: boolean;

    link: string;
    enabled?: boolean;
    createdAt?: Date;
    commission: number;
    minBetSize: number;
    cpa: number;
    monthlyLimit?: number | null;
  }) {
    this.clientId = clientId;
    this.clientName = clientName;
    this.type = type;
    this.betMatchEnabled = betMatchEnabled;

    this.link = link;
    this.enabled = enabled;
    this.createdAt = createdAt;
    this.commission = commission;
    this.minBetSize = minBetSize;
    this.cpa = cpa;
    this.monthlyLimit = monthlyLimit;
  }

  public get id(): string {
    return `${this.clientId}_${this.type}`;
  }

  public get description(): string {
    const linkTypeLabel: string = getReferralLinkTypeLabel(this.type);
    return `${this.clientName} (${linkTypeLabel}) `;
  }

  public get conversionTypes(): ConversionType[] {
    const conversionTypes: ConversionType[] = [ConversionType.freeBet];
    if (this.betMatchEnabled) {
      conversionTypes.push(ConversionType.betMatch);
    }
    return conversionTypes;
  }

  public toFirestoreDoc(): DocumentData {
    return {
      clientId: this.clientId,
      clientName: this.clientName,
      type: this.type,
      betMatchEnabled: this.betMatchEnabled,
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
      betMatchEnabled: doc.betMatchEnabled,
      link: doc.link,
      enabled: doc.enabled,
      createdAt: doc.createdAt ? doc.createdAt.toDate() : new Date(),
      commission: doc.commission,
      minBetSize: doc.minBetSize,
      cpa: doc.cpa,
    });
  }
}
