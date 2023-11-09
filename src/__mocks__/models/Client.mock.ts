import { Client } from "../../models/Client";
import {
  casinoAffiliateDeal1,
  sportsAffiliateDeal1,
} from "./AffiliateDeal.mock";

// Sample Client Instances
const clientSample1 = new Client({
  id: "client1",
  name: "Casino Royale",
  casinoAffiliateDeal: casinoAffiliateDeal1,
  enabled: true,
});

const clientSample2 = new Client({
  id: "client2",
  name: "SportsMania",
  sportsAffiliateDeal: sportsAffiliateDeal1,
  enabled: true,
});

const clientSample3 = new Client({
  id: "client3",
  name: "MultiDeals Inc.",
  casinoAffiliateDeal: casinoAffiliateDeal1,
  sportsAffiliateDeal: sportsAffiliateDeal1,
  enabled: true,
});

// Export the samples
export const clientSamples = [clientSample1, clientSample2, clientSample3];
