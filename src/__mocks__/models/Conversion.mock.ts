import { Conversion } from "../../models/Conversion";
import { Currency } from "../../models/enums/Currency";
import affiliateLinkSample from "./AffiliateLink.mock";
import { customerSample } from "./Customer.mock";
import { sampleMessages } from "./Message.mock";

// Sample Data for Conversion
export const conversionSample = new Conversion({
  id: "conv123",
  dateOccured: new Date(),
  loggedAt: new Date(),
  userId: "user123",
  affliateLink: affiliateLinkSample,
  customer: customerSample,
  amount: 100,
  currency: Currency.CAD,
  messages: sampleMessages,
});

export const sampleConversions = [
  conversionSample,
  conversionSample,
  conversionSample,
];
