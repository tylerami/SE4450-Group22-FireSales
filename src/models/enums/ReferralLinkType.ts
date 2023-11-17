export enum ReferralLinkType {
  casino = "casino",
  sports = "sports",
}

const ReferralLinkTypeLabel: Record<ReferralLinkType, string> = {
  [ReferralLinkType.casino]: "Casino",
  [ReferralLinkType.sports]: "Sports",
};

export function getReferralLinkTypeLabel(
  referralLinkType: ReferralLinkType | null | undefined
) {
  if (!referralLinkType) {
    return "Casino & Sports";
  }
  return ReferralLinkTypeLabel[referralLinkType];
}
