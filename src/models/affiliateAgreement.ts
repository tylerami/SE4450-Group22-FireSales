export class AffiliateAgreement {
  id: string;
  cpa: number;
  revenueShare?: number;
  currencyIso: string;
  effectiveFrom: Date;
  effectiveUntil?: Date;

  constructor(
    id: string,
    cpa: number,
    currencyIso: string,
    effectiveFrom: Date,
    effectiveUntil?: Date,
    revenueShare?: number
  ) {
    this.id = id;
    this.cpa = cpa;
    this.currencyIso = currencyIso;
    this.effectiveFrom = effectiveFrom;
    this.effectiveUntil = effectiveUntil;
    this.revenueShare = revenueShare;
  }
}
