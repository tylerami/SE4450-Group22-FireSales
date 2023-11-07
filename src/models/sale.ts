export class Sale {
  saleId: string;
  date: Date;
  userId: string;
  clientId: string;
  commission: number;
  currencyIso: string;
  customerId: string;
  amount: number;
  attachments?: Array<File>;

  constructor(
    saleId: string,
    date: Date,
    userId: string,
    clientId: string,
    commission: number,
    currencyIso: string,
    customerId: string,
    amount: number,
    attachments?: Array<File>
  ) {
    this.saleId = saleId;
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

function createSaleId({
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
  return `${dateString}-${userId}-${clientId}-${customerId}`;
}

function dateFromDD_MM_YYYY(dateString: string): Date {
  const [day, month, year] = dateString.split("-");
  return new Date(`${year}-${month}-${day}`);
}
