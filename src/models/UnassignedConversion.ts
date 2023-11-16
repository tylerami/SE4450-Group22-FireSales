import { dateFromDDMMYYYY, formatDateString } from "../utils/Date";
import { AffiliateLink } from "./AffiliateLink";
import { Conversion } from "./Conversion";
import { Customer } from "./Customer";
import { Message } from "./Message";
import { ConversionStatus } from "./enums/ConversionStatus";
import { Currency } from "./enums/Currency";
import { Timestamp, DocumentData } from "firebase/firestore";

export type ConversionAttachmentGroup = {
  conversion: UnassignedConversion;
  attachments: File[];
};

export class UnassignedConversion {
  assignmentCode: string;
  id: string;
  dateOccured: Date;
  loggedAt: Date;
  status: ConversionStatus;
  compensationGroupId?: string;
  affiliateLink: AffiliateLink;
  customer: Customer;
  amount: number; // Bet size
  attachmentUrls?: Array<string>;
  currency: Currency;
  messages: Array<Message>;

  constructor({
    assignmentCode,
    id,
    dateOccured,
    loggedAt,

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
    assignmentCode: string;
    status: ConversionStatus;
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
    this.assignmentCode = assignmentCode;
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
    assignmentCode,
    compensationGroupId,
    affiliateLink,
    customer,
    amount,
    attachmentUrls,
    currency = Currency.CAD,
  }: {
    dateString: string;
    assignmentCode: string;
    compensationGroupId: string;
    affiliateLink: AffiliateLink;
    currency?: Currency;
    customer: Customer;
    amount: number;
    attachmentUrls?: Array<string>;
  }) {
    const id = getUnassignedConversionId({
      dateString,
      clientId: affiliateLink.clientId,
      assignmentCode,
      customerId: customer.id,
    });
    const dateOccured = dateFromDDMMYYYY(dateString);
    const loggedAt = new Date();
    return new UnassignedConversion({
      id,
      dateOccured,
      loggedAt,
      assignmentCode,
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
      assignmentCode: this.assignmentCode,
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

  public static fromFirestoreDoc(doc: DocumentData): UnassignedConversion {
    return new UnassignedConversion({
      id: doc.id,
      dateOccured: doc.dateOccured ? doc.dateOccured.toDate() : new Date(),
      loggedAt: doc.loggedAt ? doc.loggedAt.toDate() : new Date(),
      assignmentCode: doc.assignmentCode,
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

export function assignConversionsToUser({
  unassignedConversions,
  userId,
}: {
  unassignedConversions: UnassignedConversion[];
  userId: string;
}) {
  return unassignedConversions.map((conv) => {
    return new Conversion({
      userId,
      ...conv,
    });
  });
}

export function getUnassignedConversionId({
  dateString,
  clientId,
  assignmentCode,
  customerId,
}: {
  dateString: string;
  clientId: string;
  assignmentCode: string;
  customerId: string;
}): string {
  return `${dateString}_${assignmentCode}_${clientId}_${customerId}_UNASSIGNED`;
}
