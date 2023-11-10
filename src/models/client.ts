import { AffiliateDeal } from "./AffiliateDeal";
import { ReferralLinkType } from "./enums/ReferralLinkType";

type AffiliateDealContainer = {
  [key in ReferralLinkType]?: AffiliateDeal | undefined;
};

export class Client {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
  affiliateDeals: AffiliateDealContainer;
  enabled: boolean;

  constructor({
    id,
    name,
    createdAt = new Date(),
    updatedAt,
    affiliateDeals,
    enabled = true,
  }: {
    id: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    affiliateDeals?: AffiliateDealContainer;
    enabled?: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.affiliateDeals = affiliateDeals || {};
    this.enabled = enabled;
  }

  public hasSportsbookAffiliateDeal = () =>
    this.affiliateDeals[ReferralLinkType.sports] !== undefined;
  public hasCasinoAffiliateDeal = () =>
    this.affiliateDeals[ReferralLinkType.casino] !== undefined;
  public hasCasinoAndSportsAffiliateDeal = () =>
    this.affiliateDeals[ReferralLinkType.casinoAndSports] !== undefined;

  public getSportsbookAffiliateDeal = () =>
    this.affiliateDeals[ReferralLinkType.sports];
  public getCasinoAffiliateDeal = () =>
    this.affiliateDeals[ReferralLinkType.casino];
  public getCasinoAndSportsAffiliateDeal = () =>
    this.affiliateDeals[ReferralLinkType.casinoAndSports];

  public setSportsbookAffiliateDeal = (affiliateDeal: AffiliateDeal | null) => {
    if (affiliateDeal === null) {
      delete this.affiliateDeals[ReferralLinkType.sports];
    }
    this.affiliateDeals[ReferralLinkType.sports] =
      affiliateDeal as AffiliateDeal;
  };
  public setCasinoAffiliateDeal = (affiliateDeal: AffiliateDeal | null) => {
    if (affiliateDeal === null) {
      delete this.affiliateDeals[ReferralLinkType.casino];
    }
    this.affiliateDeals[ReferralLinkType.casino] =
      affiliateDeal as AffiliateDeal;
  };
  public setCasinoAndSportsAffiliateDeal = (
    affiliateDeal: AffiliateDeal | null
  ) => {
    if (affiliateDeal === null) {
      delete this.affiliateDeals[ReferralLinkType.casinoAndSports];
    }
    this.affiliateDeals[ReferralLinkType.casinoAndSports] =
      affiliateDeal as AffiliateDeal;
  };
}
