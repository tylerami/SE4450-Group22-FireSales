import { CompensationGroup } from "models/CompensationGroup";
import { generateSampleCompensationGroups } from "__mocks__/models/CompensationGroup.mock";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";

export class MockCompensationGroupService implements CompensationGroupService {
  getAllAssignmentCodeCompGroupIds(): Promise<Record<string, string | null>> {
    throw new Error("Method not implemented.");
  }
  getAssignmentCodeCompGroupId(code: string): Promise<string | null> {
    throw new Error("Method not implemented.");
  }
  setAssignmentCodeCompGroupId(
    code: string,
    compGroupId: string
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  set(compensationGroup: CompensationGroup): Promise<CompensationGroup> {
    throw new Error("Method not implemented.");
  }
  async create(
    compensationGroup: CompensationGroup
  ): Promise<CompensationGroup> {
    return compensationGroup;
  }

  async get(compensationGroupId: string): Promise<CompensationGroup | null> {
    return generateSampleCompensationGroups(1)[0];
  }

  async update(
    compensationGroup: CompensationGroup | Partial<CompensationGroup>
  ): Promise<CompensationGroup> {
    return compensationGroup as CompensationGroup;
  }

  async getAll(): Promise<CompensationGroup[]> {
    return generateSampleCompensationGroups(5);
  }
}
