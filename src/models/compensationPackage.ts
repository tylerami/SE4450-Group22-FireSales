

export class CompensationPackage {
    packageId: string;
    currency: string;
    monthlySalary: number;
    saleCommission: number;
    effectiveFrom: number;
    effectiveUntil?: number;

    constructor(
        packageId: string,
        currency: string,
        monthlySalary: number,
        saleCommission: number,
        effectiveFrom: number,
        effectiveUntil?: number
    ) {
        this.packageId = packageId;
        this.currency = currency;
        this.monthlySalary = monthlySalary;
        this.saleCommission = saleCommission;
        this.effectiveFrom = effectiveFrom;
        this.effectiveUntil = effectiveUntil;
    }
}
