export enum ReferralLinkType {
  casino = "casino",
  sports = "sports",
  casinoAndSports = "casinoAndSports",
}

const ReferralLinkTypeLabel: Record<ReferralLinkType, string> = {
  [ReferralLinkType.casino]: "Casino",
  [ReferralLinkType.sports]: "Sports",
  [ReferralLinkType.casinoAndSports]: "Casino & Sports",
};

export function getReferralLinkTypeLabel(referralLinkType: ReferralLinkType) {
  return ReferralLinkTypeLabel[referralLinkType];
}
