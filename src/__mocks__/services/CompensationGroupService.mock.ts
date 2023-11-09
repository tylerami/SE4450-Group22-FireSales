import { CompensationGroup } from "@models/CompensationGroup";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";

export class MockCompensationGroupService implements CompensationGroupService {
  async create(
    compensationGroup: CompensationGroup
  ): Promise<CompensationGroup> {
    return compensationGroup;
  }

  async get(compensationGroupId: string): Promise<CompensationGroup | null> {
    return null;
  }

  async update(
    compensationGroup: CompensationGroup | Partial<CompensationGroup>
  ): Promise<CompensationGroup> {
    return compensationGroup as CompensationGroup;
  }

  async getAll(): Promise<CompensationGroup[]> {
    return [];
  }
}
