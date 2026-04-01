import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  setUserProfile(profileJson: string): Promise<void>;
  getUserProfile(): Promise<string | null>;
  clearUserProfile(): Promise<void>;
}

export default TurboModuleRegistry.get<Spec>('UserProfile');
