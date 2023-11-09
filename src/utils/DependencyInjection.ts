import { MockClientService } from "__mocks__/services/ClientService.mock";
import { MockCompensationGroupService } from "__mocks__/services/CompensationGroupService.mock";
import { MockConversionService } from "__mocks__/services/ConversionService.mock";
import { MockCustomerService } from "__mocks__/services/CustomerService.mock";
import { MockUserService } from "__mocks__/services/UserService.mock";
import "reflect-metadata";
import ImageFirebaseService from "services/implementations/ImageFirebaseService";

const USE_MOCKS = true;

type Constructor<T> = new (...args: any[]) => T;

const mockDependencies: Record<string, any> = {
  ClientService: new MockClientService(),
  ConversionService: new MockConversionService(),
  UserService: new MockUserService(),
  CompensationGroupService: new MockCompensationGroupService(),
  CustomerService: new MockCustomerService(),
  ImageService: new ImageFirebaseService(),
};

export const mockDependencyInjection = (): void => {
  const dependencyInjection = DependencyInjection.getInstance();
  Object.entries(mockDependencies).forEach(([key, value]) => {
    dependencyInjection.register(
      key as unknown as Constructor<any>,
      value as any
    );
  });
};

// Use singleton pattern to inject dependencies
export class DependencyInjection {
  private static instance: DependencyInjection;
  private readonly dependencies = new Map<string, any>();

  private constructor() {
    if (USE_MOCKS) {
      mockDependencyInjection();
    }
  }

  public static getInstance(): DependencyInjection {
    if (!DependencyInjection.instance) {
      DependencyInjection.instance = new DependencyInjection();
    }

    return DependencyInjection.instance;
  }

  public register<T>(token: Constructor<T>, implementation: T): void {
    this.dependencies.set(token.name, implementation);
  }

  public resolve<T>(token: Constructor<T>): T {
    const dependency = this.dependencies.get(token.name);
    if (!dependency) {
      throw new Error(`Dependency not found for: ${token.name}`);
    }
    return dependency as T;
  }
}
