import { dateFromDDMMYYYY, formatDateString } from "../utils/Date";
import { AffiliateLink } from "./AffiliateLink";
import { Customer } from "./Customer";
import { Message } from "./Message";
import { ConversionsStatus } from "./enums/ConversionStatus";
import { Currency } from "./enums/Currency";
import {
  Timeframe,
  TimeframeSegment,
  divideTimeframeIntoSegments,
  getIntervalStart,
} from "./enums/Timeframe";
import { Timestamp, DocumentData } from "firebase/firestore";

export type ConversionAttachmentGroup = {
  conversion: Conversion;
  attachments: File[];
};

export class Conversion {
  id: string;
  dateOccured: Date;
  loggedAt: Date;
  userId: string;
  status: ConversionsStatus;
  compensationGroupId?: string;
  affiliateLink: AffiliateLink;
  customer: Customer;
  amount: number; // Bet size
  attachmentUrls?: Array<string>;
  currency: Currency;
  messages: Array<Message>;

  constructor({
    id,
    dateOccured,
    loggedAt,
    userId,
    status,
    compensationGroupId,
    affiliateLink,
    customer,
    amount,
    attachmentUrls,
    currency,
    messages = [],
  }: {
    id: string;
    dateOccured: Date;
    loggedAt: Date;
    userId: string;
    status: ConversionsStatus;
    compensationGroupId?: string;
    affiliateLink: AffiliateLink;
    customer: Customer;
    amount: number;
    attachmentUrls?: Array<string>;
    currency: Currency;
    messages?: Array<Message>;
  }) {
    this.id = id;
    this.dateOccured = dateOccured;
    this.loggedAt = loggedAt;
    this.userId = userId;
    this.status = status;
    this.compensationGroupId = compensationGroupId;
    this.affiliateLink = affiliateLink;
    this.customer = customer;
    this.amount = amount;
    this.attachmentUrls = attachmentUrls;
    this.currency = currency;
    this.messages = messages;
  }

  static fromManualInput({
    dateString, // maybe modify this to accept a Date object instead
    userId,
    compensationGroupId,
    affiliateLink,
    customer,
    amount,
    attachmentUrls,
    currency = Currency.CAD,
  }: {
    dateString: string;
    userId: string;
    compensationGroupId: string;
    affiliateLink: AffiliateLink;
    currency?: Currency;
    customer: Customer;
    amount: number;
    attachmentUrls?: Array<string>;
  }) {
    const id = getConversionId({
      dateString,
      clientId: affiliateLink.clientId,
      userId,
      customerId: customer.id,
    });
    const dateOccured = dateFromDDMMYYYY(dateString);
    const loggedAt = new Date();
    return new Conversion({
      id,
      dateOccured,
      loggedAt,
      userId,
      status: ConversionsStatus.pending,
      compensationGroupId,
      affiliateLink,
      customer,
      amount,
      attachmentUrls,
      currency,
    });
  }

  public description(): string {
    return `${formatDateString(this.dateOccured)} / ${
      this.affiliateLink.clientId
    } / ${this.customer.id} / $${this.amount} bet / $${
      this.affiliateLink.commission
    } commission `;
  }

  public toFirestoreDoc(): DocumentData {
    return {
      id: this.id,
      dateOccured: this.dateOccured
        ? Timestamp.fromDate(this.dateOccured)
        : null,
      loggedAt: this.loggedAt ? Timestamp.fromDate(this.loggedAt) : null,
      userId: this.userId,
      status: this.status,
      compensationGroupId: this.compensationGroupId,
      affiliateLink: this.affiliateLink.toFirestoreDoc(),
      customer: this.customer.toFirestoreDoc(),
      amount: this.amount,
      attachmentUrls: this.attachmentUrls,
      currency: this.currency,
      messages: this.messages.map((message) => message.toFirestoreDoc()), // Assuming Message has a toFirestoreDoc method
    };
  }

  public static fromFirestoreDoc(doc: DocumentData): Conversion {
    return new Conversion({
      id: doc.id,
      dateOccured: doc.dateOccured ? doc.dateOccured.toDate() : new Date(),
      loggedAt: doc.loggedAt ? doc.loggedAt.toDate() : new Date(),
      userId: doc.userId,
      status: doc.status as ConversionsStatus,
      compensationGroupId: doc.compensationGroupId,
      affiliateLink: AffiliateLink.fromFirestoreDoc(doc.affiliateLink),
      customer: Customer.fromFirestoreDoc(doc.customer),
      amount: doc.amount,
      attachmentUrls: doc.attachmentUrls,
      currency: doc.currency as Currency,
      messages: doc.messages.map((msgDoc: DocumentData) =>
        Message.fromFirestoreDoc(msgDoc)
      ),
    });
  }
}

export type ConversionSegment = {
  segmentLabel: string;
  conversions: Array<Conversion>;
};

export function averageBetSize(conversions: Array<Conversion>): number {
  if (conversions.length === 0) {
    return 0;
  }

  const total = conversions.reduce((total, conversion) => {
    return total + conversion.amount;
  }, 0);
  return total / conversions.length;
}

export function totalBets(conversions: Array<Conversion>): number {
  return conversions.reduce((total, conversion) => {
    return total + conversion.amount;
  }, 0);
}
export function averageCommission(conversions: Array<Conversion>): number {
  if (conversions.length === 0) {
    return 0;
  }

  const total = conversions.reduce((total, conversion) => {
    return total + conversion.affiliateLink.commission;
  }, 0);
  return total / conversions.length;
}

export function totalCommission(conversions: Array<Conversion>): number {
  return conversions.reduce((total, conversion) => {
    return total + conversion.affiliateLink.commission;
  }, 0);
}

export function averageCpa(conversions: Array<Conversion>): number {
  if (conversions.length === 0) {
    return 0;
  }

  const total = conversions.reduce((total, conversion) => {
    return total + conversion.affiliateLink.cpa;
  }, 0);
  return total / conversions.length;
}

export function totalRevenue(conversions: Array<Conversion>): number {
  return conversions.reduce((total, conversion) => {
    return total + conversion.affiliateLink.cpa;
  }, 0);
}

export function averageCostOfConversion(
  conversions: Array<Conversion>
): number {
  if (conversions.length === 0) {
    return 0;
  }

  const total = conversions.reduce((total, conversion) => {
    return total + conversion.amount + conversion.affiliateLink.commission;
  }, 0);
  return total / conversions.length;
}

export function totalCostOfConversions(conversions: Array<Conversion>): number {
  return conversions.reduce((total, conversion) => {
    return total + conversion.amount + conversion.affiliateLink.commission;
  }, 0);
}

export function averageUnitContribution(
  conversions: Array<Conversion>
): number {
  if (conversions.length === 0) {
    return 0;
  }

  const total = conversions.reduce((total, conversion) => {
    return (
      total +
      conversion.affiliateLink.cpa -
      conversion.amount -
      conversion.affiliateLink.commission
    );
  }, 0);
  return total / conversions.length;
}

export function totalGrossProfit(conversions: Array<Conversion>): number {
  return conversions.reduce((total, conversion) => {
    return (
      total +
      conversion.affiliateLink.cpa -
      conversion.amount -
      conversion.affiliateLink.commission
    );
  }, 0);
}

export function segmentConversionsByTimeframe(
  conversions: Array<Conversion>,
  timeframe: Timeframe
): ConversionSegment[] {
  const timeframeSegments: TimeframeSegment[] =
    divideTimeframeIntoSegments(timeframe);

  const conversionSegments: ConversionSegment[] = timeframeSegments.map(
    (segment) => ({
      segmentLabel: segment.label,
      conversions: filterConversionsByDateInterval(conversions, {
        fromDate: segment.start,
        toDate: segment.end,
      }),
    })
  );

  return conversionSegments;
}

export function filterConversionsByDateInterval(
  conversions: Conversion[],
  { fromDate, toDate }: { fromDate?: Date; toDate?: Date }
) {
  return conversions.filter(
    (conversion) =>
      !(fromDate && conversion.dateOccured < fromDate) &&
      !(toDate && conversion.dateOccured > toDate)
  );
}

export function filterConversionsByTimeframe(
  conversions: Array<Conversion>,
  timeframe: Timeframe
): Array<Conversion> {
  const intervalStart = getIntervalStart(timeframe);
  return conversions.filter(
    (conversion) => conversion.dateOccured >= intervalStart
  );
}

export function getConversionId({
  dateString,
  clientId,
  userId,
  customerId,
}: {
  dateString: string;
  clientId: string;
  userId: string;
  customerId: string;
}): string {
  return `${dateString}_${userId}_${clientId}_${customerId}`;
}
