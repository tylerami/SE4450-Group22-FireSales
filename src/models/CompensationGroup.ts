import { AffiliateLink } from "./AffiliateLink";
import { Currency } from "./enums/Currency";

export class CompensationGroup {
  id: string;
  affiliateLinks: AffiliateLink[];
  createdAt: Date;
  updatedAt?: Date;
  enabled: boolean;
  currency: Currency;

  constructor({
    id,
    affiliateLinks = [],
    createdAt = new Date(),
    updatedAt,
    enabled = true,
    currency = Currency.CAD,
  }: {
    id: string;
    affiliateLinks?: AffiliateLink[];
    createdAt: Date;
    updatedAt?: Date;
    enabled: boolean;
    currency: Currency;
  }) {
    this.id = id;
    this.affiliateLinks = affiliateLinks;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.enabled = enabled;
    this.currency = currency;
  }
}
