import { Client } from "../../models/Client";
import {
  casinoAffiliateDeal1,
  sportsAffiliateDeal1,
} from "./AffiliateDeal.mock";

const names = ["PointsBet", "Betano", "Proline", "Bet99"];
const ids = names.map((name) => name.replaceAll(" ", "").toLowerCase());

export function generateSampleClients(count: number): Client[] {
  return Array.from({ length: count }, (_, i) => {
    return new Client({
      id: ids[i % ids.length],
      name: names[i % names.length],
      affiliateDeals: {
        sports: sportsAffiliateDeal1,
        casino: casinoAffiliateDeal1,
      },
    });
  });
}

export const sampleClients = generateSampleClients(4);
