import { Client } from "models/Client";

export interface ClientService {
  set(client: Client | Partial<Client>): Promise<Client>;
  get(clientId: string): Promise<Client | null>;
  getAll(): Promise<Client[]>;
  getHistory(clientId: string): Promise<Client[]>;
  uploadLogo(clientId: string, logo: File): Promise<string>;
  getLogoUrl(clientId: string): Promise<string | null>;
}
