import { Conversion } from "models/Conversion";
import { UnassignedConversion } from "models/UnassignedConversion";

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
    includeUnasigned,
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
    includeUnasigned?: boolean;
  }): Promise<Conversion[]>;
  // this should save the unassigned conversions to a collection called 'unassigned-conversions'
  createBulkUnassigned(
    items: Array<{
      conversion: UnassignedConversion;
      attachments?: File[];
    }>
  ): Promise<UnassignedConversion[]>;
  // this should pull all unassigned conversions attached to a code,
  // convert them to conversions using assignConversionsToUser()
  // and save them to the conversions collection
  assignConversionsWithCode({
    assignmentCode,
    userId,
  }: {
    assignmentCode: string;
    userId: string;
  }): Promise<Conversion[]>;

  isAssignmentCodeValid(code: string): Promise<boolean>;
}
