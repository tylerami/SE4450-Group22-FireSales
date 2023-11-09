import { AffiliateDeal } from "./AffiliateDeal";

export class Client {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
  casinoAffiliateDeal?: AffiliateDeal;
  sportsAffiliateDeal?: AffiliateDeal;
  enabled: boolean;

  constructor({
    id,
    name,
    createdAt = new Date(),
    updatedAt,
    casinoAffiliateDeal,
    sportsAffiliateDeal,
    enabled = true,
  }: {
    id: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    casinoAffiliateDeal?: AffiliateDeal;
    sportsAffiliateDeal?: AffiliateDeal;
    enabled?: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.casinoAffiliateDeal = casinoAffiliateDeal;
    this.sportsAffiliateDeal = sportsAffiliateDeal;
    this.enabled = enabled;
  }
}
