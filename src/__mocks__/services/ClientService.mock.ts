import { Client } from "@models/Client";
import { generateSampleClients } from "__mocks__/models/Client.mock";
import { ClientService } from "services/interfaces/ClientService";

export class MockClientService implements ClientService {
  uploadLogo(clientId: string, logo: File): Promise<string> {
    throw new Error("Method not implemented.");
  }
  getLogoUrl(clientId: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  async create(client: Client): Promise<Client> {
    return client;
  }
  async get(clientId: string): Promise<Client | null> {
    return null;
  }
  async update(client: Client | Partial<Client>): Promise<Client> {
    return client as Client;
  }
  async getAll(): Promise<Client[]> {
    return generateSampleClients(6);
  }
}
