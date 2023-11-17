import { AffiliateDeal } from "../../models/AffiliateDeal";
import { Currency } from "../../models/enums/Currency";
import { ReferralLinkType } from "../../models/enums/ReferralLinkType";

export const casinoAffiliateDeal1 = new AffiliateDeal({
  clientId: "client1",
  clientName: "Casino Royale",
  type: ReferralLinkType.casino,
  link: "https://casinoroyale.com/deal",
  cpa: 100,
  currency: Currency.CAD,
  targetBetSize: 50,
  targetMonthlyConversions: 200,
});

export const sportsAffiliateDeal1 = new AffiliateDeal({
  clientId: "client2",
  clientName: "SportsMania",
  type: ReferralLinkType.sports,
  link: "https://sportsmania.com/deal",
  cpa: 150,
  currency: Currency.USD,
  targetBetSize: 75,
  targetMonthlyConversions: 250,
});

export const generateAffiliateDeal = (
  clientId: string,
  clientName: string,
  type: ReferralLinkType
): AffiliateDeal => {
  return new AffiliateDeal({
    clientId: clientId,
    clientName: clientName,
    type: type,
    link: "https://casinoroyale.com/deal",
    cpa: 200,
    currency: Currency.CAD,
    targetBetSize: 50,
    targetMonthlyConversions: 200,
  });
};

export const sampleAffiliateDeals = [
  casinoAffiliateDeal1,
  sportsAffiliateDeal1,
];
