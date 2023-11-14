import { Payout } from "@models/Payout";
import { generateSamplePayouts } from "__mocks__/models/AffiliateLink.mock";
import { PayoutService } from "services/interfaces/PayoutService";

export class MockPayoutService implements PayoutService {
  async create(payout: Payout): Promise<Payout> {
    return payout;
  }
  async query({
    userId,
    amountMin,
    amountMax,
    dateStart,
    dateEnd,
    paymentMethod,
  }: {
    userId?: string | undefined;
    amountMin?: number | undefined;
    amountMax?: number | undefined;
    dateStart?: Date | undefined;
    dateEnd?: Date | undefined;
    paymentMethod?: string | undefined;
  }): Promise<Payout[]> {
    return generateSamplePayouts(5, userId);
  }
}