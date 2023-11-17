import { ReferralLinkType } from "models/enums/ReferralLinkType";
import { Client } from "../../models/Client";
import { generateAffiliateDeal } from "./AffiliateDeal.mock";

const names = ["PointsBet", "Betano", "Proline", "Bet99"];
const ids = names.map((name) => name.replaceAll(" ", "").toLowerCase());

export function generateSampleClients(count: number): Client[] {
  return Array.from({ length: count }, (_, i) => {
    const clientId = ids[i % ids.length];
    const clientName = names[i % names.length];
    return new Client({
      id: ids[i % ids.length],
      name: names[i % names.length],
      affiliateDeals: [
        generateAffiliateDeal(clientId, clientName, ReferralLinkType.sports),
        generateAffiliateDeal(clientId, clientName, ReferralLinkType.casino),
        generateAffiliateDeal(clientId, clientName, null),
      ],
    });
  });
}

export const sampleClients = generateSampleClients(4);
