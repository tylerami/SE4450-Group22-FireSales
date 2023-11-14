import { Payout } from "@models/Payout";
import { Currency } from "@models/enums/Currency";
import { PaymentMethod } from "@models/enums/PaymentMethod";

const userIds = ["user1", "user2", "user3", "user4"];
const paymentAddresses = ["address1", "address2", "address3", "address4"];

export function generateSamplePayouts(
  count: number,
  userId: string | null = null
): Payout[] {
  return Array.from({ length: count }, (_, i) => {
    return new Payout({
      userId: userId ?? userIds[i % userIds.length],
      amount: Math.floor(Math.random() * 1000) + 100, // Random amount between 100 and 1100
      currency: Currency.CAD, // Default to CAD
      dateOccured: new Date(),
      dateRecorded: new Date(),
      paymentMethod: PaymentMethod.etransfer, // Assume all use PayPal for simplicity
      paymentAddress: paymentAddresses[i % paymentAddresses.length],
    });
  });
}

export const samplePayouts = generateSamplePayouts(4);
