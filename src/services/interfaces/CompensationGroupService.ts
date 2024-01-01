import { CompensationGroup } from "models/CompensationGroup";

export interface CompensationGroupService {
  create(compensationGroup: CompensationGroup): Promise<CompensationGroup>;
  get(compensationGroupId: string): Promise<CompensationGroup | null>;
  set(compensationGroup: CompensationGroup): Promise<CompensationGroup>;
  getAll(): Promise<CompensationGroup[]>;

  getAssignmentCodeCompGroupId(code: string): Promise<string | null>;
  setAssignmentCodeCompGroupId(
    code: string,
    compGroupId: string | null
  ): Promise<void>;

  getAllAssignmentCodeCompGroupIds(): Promise<Record<string, string | null>>;
}
