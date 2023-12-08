import { CompensationGroup } from "models/CompensationGroup";

export interface CompensationGroupService {
  create(compensationGroup: CompensationGroup): Promise<CompensationGroup>;
  get(compensationGroupId: string): Promise<CompensationGroup | null>;
  set(compensationGroup: CompensationGroup): Promise<CompensationGroup>;
  getAll(): Promise<CompensationGroup[]>;
}
