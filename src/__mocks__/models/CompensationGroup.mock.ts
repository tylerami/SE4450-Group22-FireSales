import { AffiliateLink } from "models/AffiliateLink";
import { generateAffiliateLinks } from "./AffiliateLink.mock";
import { CompensationGroup } from "models/CompensationGroup";
import { Currency } from "models/enums/Currency";

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
        createdAt: new Date(),
        updatedAt: i % 2 === 0 ? new Date() : undefined, // Randomly assign updatedAt
        enabled: Math.random() > 0.5, // Randomly set enabled status
        currency: Currency.CAD,
      })
    );
  }
  return compensationGroups;
}
