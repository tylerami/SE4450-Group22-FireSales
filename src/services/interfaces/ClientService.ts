import { Client } from "@models/Client";

export interface ClientService {
  create(client: Client): Promise<Client>;
  get(clientId: string): Promise<Client | null>;
  update(client: Client | Partial<Client>): Promise<Client>;
  getAll(): Promise<Client[]>;
  uploadLogo(clientId: string, logo: File): Promise<string>;
  getLogoUrl(clientId: string): Promise<string | null>;
}
