import { formatDateString } from "../utils/Date";
import { AffiliateLink } from "./AffiliateLink";
import { Customer } from "./Customer";
import { Message } from "./Message";
import { Currency } from "./enums/Currency";
import {
  Timeframe,
  TimeframeSegment,
  divideTimeframeIntoSegments,
  getIntervalStart,
} from "./enums/Timeframe";

export type ConversionAttachmentGroup = {
  conversion: Conversion;
  attachments: File[];
};

export class Conversion {
  id: string;
  dateOccured: Date;
  loggedAt: Date;
  userId: string;
  compensationGroupId: string;
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
    compensationGroupId: string;
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
    const id = createSaleId({
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

export function createSaleId({
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

function dateFromDDMMYYYY(dateString: string): Date {
  const [day, month, year] = dateString.split("-");
  return new Date(`${year}-${month}-${day}`);
}
