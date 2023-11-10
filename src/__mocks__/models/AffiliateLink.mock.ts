import { Client } from "models/Client";
import { AffiliateLink } from "../../models/AffiliateLink";
import { ReferralLinkType } from "../../models/enums/ReferralLinkType";
import { sampleClients } from "./Client.mock";

const clients: Client[] = sampleClients;

const clientIds = clients.map((client) => client.id);
const clientNames = clients.map((client) => client.name);

export function generateAffiliateLinks(count: number): AffiliateLink[] {
  const affiliateLinks: AffiliateLink[] = [];
  const linkTypes: ReferralLinkType[] = Object.values(ReferralLinkType);

  for (let i = 0; i < count; i++) {
    affiliateLinks.push(
      new AffiliateLink({
        clientId: clientIds[i % clientIds.length],
        clientName: clientNames[i % clientNames.length],
        type: linkTypes[i % linkTypes.length], // or vary the type as needed
        link: `https://example.com/link${i}`,
        enabled: true,
        createdAt: new Date(),
        commission: Math.random() * 20, // Random commission for example
        minBetSize: 50 + i, // Incremental bet size for example
      })
    );
  }
  return affiliateLinks;
}
