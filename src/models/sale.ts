export class Sale {
  id: string;
  date: Date;
  userId: string;
  clientId: string;
  commission: number;
  currencyIso: string;
  customerId: string;
  amount: number;
  attachments?: Array<File>;

  constructor(
    id: string,
    date: Date,
    userId: string,
    clientId: string,
    commission: number,
    currencyIso: string,
    customerId: string,
    amount: number,
    attachments?: Array<File>
  ) {
    this.id = id;
    this.userId = userId;
    this.date = date;
    this.clientId = clientId;
    this.commission = commission;
    this.currencyIso = currencyIso;
    this.customerId = customerId;
    this.amount = amount;
    this.attachments = attachments;
  }

  static fromManualInput({
    dateString,
    clientId,
    userId,
    commission,
    currencyIso = "CAD",
    customerId,
    amount,
    attachments,
  }: {
    dateString: string;
    clientId: string;
    userId: string;
    commission: number;
    currencyIso?: string;
    customerId: string;
    amount: number;
    attachments?: Array<File>;
  }) {
    return new Sale(
      createSaleId({ dateString, clientId, userId, customerId }),
      dateFromDD_MM_YYYY(dateString),
      clientId,
      userId,
      commission,
      currencyIso,
      customerId,
      amount,
      attachments
    );
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

function dateFromDD_MM_YYYY(dateString: string): Date {
  const [day, month, year] = dateString.split("-");
  return new Date(`${year}-${month}-${day}`);
}
