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
import { ConversionType } from "./enums/ConversionType";

export type ConversionAttachmentGroup = {
  conversion: Conversion;
  attachments: File[];
};

export class Conversion {
  type: ConversionType;
  dateOccurred: Date;
  loggedAt: Date;
  userId: string | null;
  status: ConversionStatus;
  compensationGroupId: string | null;
  assignmentCode: string | null;
  affiliateLink: AffiliateLink;
  customer: Customer;
  amount: number; // Bet size
  attachmentUrls: string[];
  currency: Currency;
  messages: Array<Message>;

  constructor({
    // One of userId or assignmentCode must be provided
    assignmentCode = null,
    userId = null,
    // The following are mandatory
    type = ConversionType.freeBet,
    dateOccurred,
    customer,
    amount,
    affiliateLink,
    loggedAt = new Date(),
    status = ConversionStatus.pending,
    compensationGroupId = null,
    attachmentUrls = [],
    currency = Currency.CAD,
    messages = [],
  }: {
    type?: ConversionType;
    dateOccurred: Date;
    loggedAt?: Date;
    userId?: string | null;
    status?: ConversionStatus;
    compensationGroupId?: string | null;
    assignmentCode?: string | null;
    affiliateLink: AffiliateLink;
    customer: Customer;
    amount: number;
    attachmentUrls?: string[];
    currency?: Currency;
    messages?: Array<Message>;
  }) {
    if (userId === null && assignmentCode === null) {
      throw new Error(
        "userId and assignmentCode cannot both be null in Conversion constructor"
      );
    }
    this.type = type;
    this.dateOccurred = dateOccurred;
    this.loggedAt = loggedAt;
    this.userId = userId;
    this.status = status;
    this.compensationGroupId = compensationGroupId;
    this.affiliateLink = affiliateLink;
    this.assignmentCode = assignmentCode;
    this.customer = customer;
    this.amount = amount;
    this.attachmentUrls = attachmentUrls;
    this.currency = currency;
    this.messages = messages;
  }

  public get id(): string {
    if (this.userId === null && this.assignmentCode === null) {
      throw new Error(
        "userId and assignmentCode cannot both be null in Conversion constructor"
      );
    }
    const assignmentCodeOrUserId: string = this.assignmentCode || this.userId!;
    const dateOccuredString: string = formatDateString(this.dateOccurred);
    const clientId: string = this.affiliateLink.clientId;
    const customerId: string = this.customer.id;

    return `${dateOccuredString}_${assignmentCodeOrUserId}_${clientId}_${customerId}`;
  }

  public isUnassigned = (): boolean => {
    return this.userId === null;
  };

  public addMessage = (message: Message): Conversion => {
    return new Conversion({
      ...this,
      messages: [...this.messages, message],
    });
  };

  public addConversionAttachmentUrls = (
    newAttachmentUrls: string[]
  ): Conversion => {
    const combinedUrls = [...this.attachmentUrls, ...newAttachmentUrls];

    return new Conversion({
      ...this,
      attachmentUrls: combinedUrls,
    });
  };

  public changeStatus = (status: ConversionStatus): Conversion => {
    return new Conversion({
      ...this,
      status,
    });
  };

  public isApproved = (): boolean => {
    return (
      this.status === ConversionStatus.approvedPaid ||
      this.status === ConversionStatus.approvedUnpaid
    );
  };

  public isApprovedNotPaid = (): boolean => {
    return this.status === ConversionStatus.approvedUnpaid;
  };

  public isPending = (): boolean => {
    return this.status === ConversionStatus.pending;
  };

  public isRejected = (): boolean => {
    return this.status === ConversionStatus.rejected;
  };

  public isPaid = (): boolean => {
    return this.status === ConversionStatus.approvedPaid;
  };

  public description(): string {
    return `${formatDateString(this.dateOccurred)} / ${
      this.affiliateLink.clientId
    } / ${this.customer.id} / $${this.amount} bet / $${
      this.affiliateLink.commission
    } commission `;
  }

  public toFirestoreDoc(): DocumentData {
    return {
      dateOccurred: this.dateOccurred
        ? Timestamp.fromDate(this.dateOccurred)
        : null,
      loggedAt: this.loggedAt ? Timestamp.fromDate(this.loggedAt) : null,
      userId: this.userId,
      status: this.status,
      compensationGroupId: this.compensationGroupId,
      affiliateLink: this.affiliateLink.toFirestoreDoc(),
      assignmentCode: this.assignmentCode,
      customer: this.customer.toFirestoreDoc(),
      amount: this.amount,
      attachmentUrls: this.attachmentUrls,
      currency: this.currency,
      messages: this.messages.map((message) => message.toFirestoreDoc()), // Assuming Message has a toFirestoreDoc method
    };
  }

  public static fromFirestoreDoc(doc: DocumentData): Conversion {
    return new Conversion({
      type: doc.type as ConversionType,
      dateOccurred: doc.dateOccurred ? doc.dateOccurred.toDate() : new Date(),
      loggedAt: doc.loggedAt ? doc.loggedAt.toDate() : new Date(),
      userId: doc.userId,
      status: doc.status as ConversionStatus,
      compensationGroupId: doc.compensationGroupId,
      affiliateLink: AffiliateLink.fromFirestoreDoc(doc.affiliateLink),
      assignmentCode: doc.assignmentCode,
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

export function totalUnpaidCommission(conversions: Array<Conversion>): number {
  return conversions.reduce((total, conversion) => {
    if (conversion.isApprovedNotPaid()) {
      return total + conversion.affiliateLink.commission;
    }
    return total;
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

export function conversionsWithLink(
  conversions: Array<Conversion>,
  link: AffiliateLink
): Array<Conversion> {
  return conversions.filter(
    (conversion) => conversion.affiliateLink.id === link.id
  );
}

export function conversionsWithType(
  conversions: Array<Conversion>,
  type: ConversionType
): Array<Conversion> {
  return conversions.filter((conversion) => conversion.type === type);
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

export function allClientIds(conversions: Array<Conversion>): string[] {
  const clientIds = conversions.map(
    (conversion) => conversion.affiliateLink.clientId
  );
  return [...new Set(clientIds)];
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
      conversions: conversions.filter(
        (conversion) =>
          conversion.dateOccurred.getTime() >= segment.start.getTime() &&
          conversion.dateOccurred.getTime() < segment.end.getTime()
      ),
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
  const intervalStart: Date = getIntervalStart(timeframe);
  return conversions.filter(
    (conversion) => conversion.dateOccurred.getTime() >= intervalStart.getTime()
  );
}

export function setConversionStatus(
  conversions: Array<Conversion>,
  status: ConversionStatus
): Array<Conversion> {
  return conversions.map(
    (conversion: Conversion) =>
      new Conversion({
        ...conversion,
        status,
      })
  );
}
