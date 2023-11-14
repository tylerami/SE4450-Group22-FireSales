import { Payout } from "@models/Payout";

export interface PayoutService {
  create(payout: Payout): Promise<Payout>;
  query({
    userId,
    amountMin,
    amountMax,
    dateStart,
    dateEnd,
    paymentMethod,
  }: {
    userId?: string;
    amountMin?: number;
    amountMax?: number;
    dateStart?: Date;
    dateEnd?: Date;
    paymentMethod?: string;
  }): Promise<Payout[]>;
}
