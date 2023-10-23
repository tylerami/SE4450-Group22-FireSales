export class Sale {
    saleId: string;
    timestamp: Date;
    clientId: string;
    commission: number;
    currencyIso: string;
    customerId: string;
    amount: number;
    attachments?: Array<string>;

    constructor(
        saleId: string,
        timestamp: Date,
        clientId: string,
        commission: number,
        currencyIso: string,
        customerId: string,
        amount: number,
        attachments?: Array<string>
    ) {
        this.saleId = saleId;
        this.timestamp = timestamp;
        this.clientId = clientId;
        this.commission = commission;
        this.currencyIso = currencyIso;
        this.customerId = customerId;
        this.amount = amount;
        this.attachments = attachments;
    }
}