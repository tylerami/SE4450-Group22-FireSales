import { Conversion } from "@models/Conversion";

export interface ConversionService {
  create(
    conversion: Conversion,
    { attachments }: { attachments?: File[] }
  ): Promise<Conversion>;
  createBulk(
    items: Array<{ conversion: Conversion; attachments?: File[] }>
  ): Promise<Conversion[]>;
  query({
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
    userId?: string;
    clientId?: string;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    minCommission?: number;
    maxCommission?: number;
    compensationGroupId?: string;
    referralLinkType?: string;
  }): Promise<Conversion[]>;
}
