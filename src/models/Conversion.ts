import { formatDateString } from "../utils/Date";
import { AffiliateLink } from "./AffiliateLink";
import { Customer } from "./Customer";
import { Message } from "./Message";
import { Currency } from "./enums/Currency";

export class Conversion {
  id: string;
  dateOccured: Date;
  loggedAt: Date;
  userId: string;
  compensationGroupId: string;
  affliateLink: AffiliateLink;
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
    affliateLink,
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
    affliateLink: AffiliateLink;
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
    this.affliateLink = affliateLink;
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
    affliateLink,
    customer,
    amount,
    attachmentUrls,
    currency = Currency.CAD,
  }: {
    dateString: string;
    userId: string;
    compensationGroupId: string;
    affliateLink: AffiliateLink;
    currency?: Currency;
    customer: Customer;
    amount: number;
    attachmentUrls?: Array<string>;
  }) {
    const id = createSaleId({
      dateString,
      clientId: affliateLink.clientId,
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
      affliateLink,
      customer,
      amount,
      attachmentUrls,
      currency,
    });
  }

  public description(): string {
    return `${formatDateString(this.dateOccured)} / ${
      this.affliateLink.clientId
    } / ${this.customer.id} / $${this.amount} bet / $${
      this.affliateLink.commission
    } commission `;
  }
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