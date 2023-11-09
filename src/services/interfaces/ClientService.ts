import { AffiliateDeal } from "@models/AffiliateDeal";
import { Client } from "@models/Client";

export interface ClientService {
  create(client: Client): Promise<Client>;
  get(clientId: string): Promise<Client | null>;
  update(client: Client | Partial<Client>): Promise<Client>;
  getAll(): Promise<Client[]>;
  setSportsAffiliateDeal(
    clientId: string,
    sportsAffiliateDeal: AffiliateDeal | null
  ): Promise<Client>;
  setCasinoAffiliateDeal(
    clientId: string,
    casinoAffiliateDeal: AffiliateDeal | null
  ): Promise<Client>;
}
