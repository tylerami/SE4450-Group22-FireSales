import { formatDateString } from "./utils/Date";
import { AffiliateLink } from "./AffiliateLink";
import { Customer } from "./Customer";
import { Message } from "./Message";
import { ConversionStatus } from "./enums/ConversionStatus";
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
  dateOccurred: Date;
  loggedAt: Date;
  userId: string;
  status: ConversionStatus;
  compensationGroupId: string | null;
  affiliateLink: AffiliateLink;
  customer: Customer;
  amount: number; // Bet size
  attachmentUrls: Array<string>;
  currency: Currency;
  messages: Array<Message>;

  constructor({
    id,
    dateOccurred,
    loggedAt,
    userId,
    status,
    compensationGroupId = null,
    affiliateLink,
    customer,
    amount,
    attachmentUrls = [],
    currency,
    messages = [],
  }: {
    id: string;
    dateOccurred: Date;
    loggedAt: Date;
    userId: string;
    status: ConversionStatus;
    compensationGroupId?: string | null;
    affiliateLink: AffiliateLink;
    customer: Customer;
    amount: number;
    attachmentUrls?: Array<string>;
    currency: Currency;
    messages?: Array<Message>;
  }) {
    this.id = id;
    this.dateOccurred = dateOccurred;
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
    dateOccurred, // maybe modify this to accept a Date object instead
    userId,
    compensationGroupId,
    affiliateLink,
    customer,
    amount,
    attachmentUrls,
    currency = Currency.CAD,
  }: {
    dateOccurred: Date;
    userId: string;
    compensationGroupId: string;
    affiliateLink: AffiliateLink;
    currency?: Currency;
    customer: Customer;
    amount: number;
    attachmentUrls?: Array<string>;
  }) {
    const id = getConversionId({
      dateOccurred,
      clientId: affiliateLink.clientId,
      userId,
      customerId: customer.id,
    });

    const loggedAt = new Date();
    return new Conversion({
      id,
      dateOccurred,
      loggedAt,
      userId,
      status: ConversionStatus.pending,
      compensationGroupId,
      affiliateLink,
      customer,
      amount,
      attachmentUrls,
      currency,
    });
  }

  public description(): string {
    return `${formatDateString(this.dateOccurred)} / ${
      this.affiliateLink.clientId
    } / ${this.customer.id} / $${this.amount} bet / $${
      this.affiliateLink.commission
    } commission `;
  }

  public toFirestoreDoc(): DocumentData {
    return {
      id: this.id,
      dateOccurred: this.dateOccurred
        ? Timestamp.fromDate(this.dateOccurred)
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
      dateOccurred: doc.dateOccurred ? doc.dateOccurred.toDate() : new Date(),
      loggedAt: doc.loggedAt ? doc.loggedAt.toDate() : new Date(),
      userId: doc.userId,
      status: doc.status as ConversionStatus,
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
      !(fromDate && conversion.dateOccurred < fromDate) &&
      !(toDate && conversion.dateOccurred > toDate)
  );
}

export function filterConversionsByTimeframe(
  conversions: Array<Conversion>,
  timeframe: Timeframe
): Array<Conversion> {
  const intervalStart = getIntervalStart(timeframe);
  return conversions.filter(
    (conversion) => conversion.dateOccurred >= intervalStart
  );
}

export function getConversionId({
  dateOccurred,
  clientId,
  userId,
  customerId,
}: {
  dateOccurred: Date;
  clientId: string;
  userId: string;
  customerId: string;
}): string {
  return `${formatDateString(
    dateOccurred
  )}_${userId}_${clientId}_${customerId}`;
}
