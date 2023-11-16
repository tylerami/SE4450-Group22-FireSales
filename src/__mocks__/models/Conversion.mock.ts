import { ConversionStatus } from "models/enums/ConversionStatus";
import { Conversion } from "../../models/Conversion";
import { Currency } from "../../models/enums/Currency";
import { generateAffiliateLinks } from "./AffiliateLink.mock";
import { customerSample } from "./Customer.mock";
import { sampleMessages } from "./Message.mock";

// Sample Data for Conversion
export const conversionSample = new Conversion({
  id: "conv123",
  dateOccurred: new Date(),
  loggedAt: new Date(),
  userId: "user123",
  status: ConversionStatus.pending,
  compensationGroupId: "comp123",
  affiliateLink: generateAffiliateLinks(1)[0],
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
