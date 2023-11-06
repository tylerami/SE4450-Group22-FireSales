export class Client {
  id: string;
  name: string;
  affiliateAgreementId: string;
  createdAt: Date;
  isActive: boolean;

  constructor(
    id: string,
    name: string,
    affiliateAgreementId: string,
    createdAt: Date,
    isActive: boolean
  ) {
    this.id = id;
    this.name = name;
    this.affiliateAgreementId = affiliateAgreementId;
    this.createdAt = createdAt;
    this.isActive = isActive;
  }
}
