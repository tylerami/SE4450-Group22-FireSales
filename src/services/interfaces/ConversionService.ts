import { Conversion } from "src/models/Conversion";

export interface ConversionService {
  create(conversion: Conversion, attachments?: File[]): Promise<Conversion>;
  createBulk(
    items: Array<{ conversion: Conversion; attachments?: File[] }>
  ): Promise<Conversion[]>;
  update(conversion: Conversion, attachments?: File[]): Promise<Conversion>;
  updateBulk(conversions: Conversion[]): Promise<Conversion[]>;

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
    includeUnassigned,
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
    includeUnassigned?: boolean;
  }): Promise<Conversion[]>;

  assignConversionsWithCode({
    assignmentCode,
    userId,
  }: {
    assignmentCode: string;
    userId: string;
  }): Promise<Conversion[]>;

  isAssignmentCodeValid(code: string): Promise<boolean>;
}
