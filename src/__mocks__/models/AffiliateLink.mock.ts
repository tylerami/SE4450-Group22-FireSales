import { AffiliateLink } from "../../models/AffiliateLink";
import { ReferralLinkType } from "../../models/enums/ReferralLinkType";

const affiliateLinkSample = new AffiliateLink({
  clientId: "client123",
  type: ReferralLinkType.casino,
  link: "https://example.com/ref=client123",
  commission: 0.1,
  minBetSize: 50,
});

export default affiliateLinkSample;
