import { formatDateString } from "./utils/Date";
import { AffiliateLink } from "./AffiliateLink";
import { Conversion, getConversionId } from "./Conversion";
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
  dateOccurred: Date;
  loggedAt: Date;
  status: ConversionStatus;
  compensationGroupId: string | null;
  affiliateLink: AffiliateLink;
  customer: Customer;
  amount: number; // Bet size
  attachmentUrls: Array<string>;
  currency: Currency;
  messages: Array<Message>;

  constructor({
    assignmentCode,
    id,
    dateOccurred,
    loggedAt,
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
    assignmentCode: string;
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
    dateOccurred,
    assignmentCode,
    compensationGroupId,
    affiliateLink,
    customer,
    amount,
    attachmentUrls,
    currency = Currency.CAD,
  }: {
    dateOccurred: Date;
    assignmentCode: string;
    compensationGroupId?: string;
    affiliateLink: AffiliateLink;
    currency?: Currency;
    customer: Customer;
    amount: number;
    attachmentUrls?: Array<string>;
  }) {
    const id = getUnassignedConversionId({
      dateOccurred,
      clientId: affiliateLink.clientId,
      assignmentCode,
      customerId: customer.id,
    });
    const loggedAt = new Date();
    return new UnassignedConversion({
      id,
      dateOccurred,
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

  public addConversionAttachmentUrls = (
    newAttachmentUrls: string[]
  ): UnassignedConversion => {
    const combinedUrls = [...this.attachmentUrls, ...newAttachmentUrls];

    return new UnassignedConversion({
      ...this,
      attachmentUrls: combinedUrls,
    });
  };

  public withNewAssignmentCode(assignmentCode: string): UnassignedConversion {
    return new UnassignedConversion({
      ...this,
      id: getUnassignedConversionId({
        dateOccurred: this.dateOccurred,
        clientId: this.affiliateLink.clientId,
        assignmentCode,
        customerId: this.customer.id,
      }),
      assignmentCode,
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
      dateOccurred: doc.dateOccurred ? doc.dateOccurred.toDate() : new Date(),
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
  return unassignedConversions.map((conv) =>
    Conversion.fromUnassignedConversion(conv, userId)
  );
}

export function getUnassignedConversionId({
  dateOccurred,
  clientId,
  assignmentCode,
  customerId,
}: {
  dateOccurred: Date;
  clientId: string;
  assignmentCode: string;
  customerId: string;
}): string {
  return `${formatDateString(
    dateOccurred
  )}_${assignmentCode}_${clientId}_${customerId}_UNASSIGNED`;
}
