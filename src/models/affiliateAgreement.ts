export class AffiliateAgreement {
    relationshipId: string;
    cpa: number;
    revenueShare?: number;
    currencyIso: string;
    effectiveFrom: Date;
    effectiveUntil?: Date;

    constructor(
        relationshipId: string,
        cpa: number,
        currencyIso: string,
        effectiveFrom: Date,
        effectiveUntil?: Date,
        revenueShare?: number,
    ) {
        this.relationshipId = relationshipId;
        this.cpa = cpa;
        this.currencyIso = currencyIso;
        this.effectiveFrom = effectiveFrom;
        this.effectiveUntil = effectiveUntil;
        this.revenueShare = revenueShare;
    }
}
