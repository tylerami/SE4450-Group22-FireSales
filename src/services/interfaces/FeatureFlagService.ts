interface FeatureFlagService {
  getFlagValue<T>(flagName: string): Promise<T | null>;
}

export default FeatureFlagService;
