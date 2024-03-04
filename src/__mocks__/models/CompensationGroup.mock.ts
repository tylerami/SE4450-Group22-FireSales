import { AffiliateLink } from "src/models/AffiliateLink";
import { generateAffiliateLinks } from "./AffiliateLink.mock";
import { CompensationGroup } from "src/models/CompensationGroup";
import { Currency } from "src/models/enums/Currency";

export function generateSampleCompensationGroups(
  count: number
): CompensationGroup[] {
  const compensationGroups: CompensationGroup[] = [];
  for (let i = 0; i < count; i++) {
    const affiliateLinks: AffiliateLink[] = generateAffiliateLinks(6);
    compensationGroups.push(
      new CompensationGroup({
        id: `group${i}`,
        affiliateLinks: affiliateLinks,
        timestamp: new Date(),
        enabled: Math.random() > 0.5, // Randomly set enabled status
        currency: Currency.CAD,
      })
    );
  }
  return compensationGroups;
}
