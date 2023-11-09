import { Conversion } from "@models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";

export class MockConversionService implements ConversionService {
  async create(
    conversion: Conversion,
    { attachments }: { attachments?: File[] | undefined }
  ): Promise<Conversion> {
    return conversion;
  }
  async createBulk(
    items: { conversion: Conversion; attachments?: File[] | undefined }[]
  ): Promise<Conversion[]> {
    return items.map((item) => item.conversion);
  }
  async query({
    userId,
    clientId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    minCommission,
    maxCommission,
    compensationGroupId,
    referralLinkType,
  }: {
    userId?: string | undefined;
    clientId?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    minAmount?: number | undefined;
    maxAmount?: number | undefined;
    minCommission?: number | undefined;
    maxCommission?: number | undefined;
    compensationGroupId?: string | undefined;
    referralLinkType?: string | undefined;
  }): Promise<Conversion[]> {
    return [];
  }
}
