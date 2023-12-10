import { Conversion } from "models/Conversion";
import { sampleConversions } from "__mocks__/models/Conversion.mock";
import { ConversionService } from "services/interfaces/ConversionService";

export class MockConversionService implements ConversionService {
  create(
    conversion: Conversion,
    attachments?: File[] | undefined
  ): Promise<Conversion> {
    throw new Error("Method not implemented.");
  }
  update(
    conversion: Conversion,
    attachments?: File[] | undefined
  ): Promise<Conversion> {
    throw new Error("Method not implemented.");
  }

  updateBulk(conversions: Conversion[]): Promise<Conversion[]> {
    throw new Error("Method not implemented.");
  }
  isAssignmentCodeValid(code: string): Promise<boolean> {
    throw new Error("Method not implemented.");
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
    return sampleConversions;
  }

  async assignConversionsWithCode({
    assignmentCode,
    userId,
  }: {
    assignmentCode: string;
    userId: string;
  }): Promise<Conversion[]> {
    throw new Error("Method not implemented.");
  }
}
