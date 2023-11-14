import { MockClientService } from "__mocks__/services/ClientService.mock";
import { MockCompensationGroupService } from "__mocks__/services/CompensationGroupService.mock";
import { MockConversionService } from "__mocks__/services/ConversionService.mock";
import { MockCustomerService } from "__mocks__/services/CustomerService.mock";
import { MockUserService } from "__mocks__/services/UserService.mock";
import "reflect-metadata";
import ImageFirebaseService from "services/implementations/ImageFirebaseService";
import { ClientService } from "services/interfaces/ClientService";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { ConversionService } from "services/interfaces/ConversionService";
import { CustomerService } from "services/interfaces/CustomerService";
import { ImageService } from "services/interfaces/ImageService";
import { UserService } from "services/interfaces/UserService";

const USE_MOCKS = true;

const mockDependencies: Record<string, any> = {
  ClientService: new MockClientService(),
  ConversionService: new MockConversionService(),
  UserService: new MockUserService(),
  CompensationGroupService: new MockCompensationGroupService(),
  CustomerService: new MockCustomerService(),
  PayoutService: new MockPayoutService(),
  // Firebase image service already implemented
  ImageService: new ImageFirebaseService(),
};

// Use singleton pattern to inject dependencies
export class DependencyInjection {
  private static instance: DependencyInjection;
  private readonly dependencies = new Map<string, any>();

  private setupMockDependencies(): void {
    Object.entries(mockDependencies).forEach(([key, value]) => {
      this.register(key, value);
    });
  }

  private constructor() {
    if (USE_MOCKS) {
      this.setupMockDependencies();
    }
  }

  public static getInstance(): DependencyInjection {
    if (!DependencyInjection.instance) {
      DependencyInjection.instance = new DependencyInjection();
    }

    return DependencyInjection.instance;
  }

  private register<T>(token: string, implementation: T): void {
    this.dependencies.set(token, implementation);
  }

  private resolve<T>(token: string): T {
    const dependency = this.dependencies.get(token);
    if (!dependency) {
      throw new Error(`Dependency not found for: ${token}`);
    }
    return dependency as T;
  }

  public static clientService = (): ClientService =>
    this.getInstance().resolve<ClientService>("ClientService");

  public static conversionService = (): ConversionService =>
    this.getInstance().resolve<ConversionService>("ConversionService");

  public static userService = (): UserService =>
    this.getInstance().resolve<UserService>("UserService");

  public static compensationGroupService = (): CompensationGroupService =>
    this.getInstance().resolve<CompensationGroupService>(
      "CompensationGroupService"
    );

  public static customerService = (): CustomerService =>
    this.getInstance().resolve<CustomerService>("CustomerService");

  public static imageService = (): ImageService =>
    this.getInstance().resolve<ImageService>("ImageService");
}
