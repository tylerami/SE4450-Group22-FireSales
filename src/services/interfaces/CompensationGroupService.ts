import { CompensationGroup } from "models/CompensationGroup";
import { User } from "models/User";

export interface CompensationGroupService {
  create(compensationGroup: CompensationGroup): Promise<CompensationGroup>;
  get(compensationGroupId: string): Promise<CompensationGroup | null>;
  set(compensationGroup: CompensationGroup): Promise<CompensationGroup>;
  getAll(): Promise<CompensationGroup[]>;
  getHistory(user: User): Promise<CompensationGroup[]>;

  delete(compGroup: CompensationGroup): Promise<boolean>;

  getAssignmentCodeCompGroupId(code: string): Promise<string | null>;
  setAssignmentCodeCompGroupId(
    code: string,
    compGroupId: string | null
  ): Promise<void>;

  getAllAssignmentCodeCompGroupIds(): Promise<Record<string, string | null>>;
}
