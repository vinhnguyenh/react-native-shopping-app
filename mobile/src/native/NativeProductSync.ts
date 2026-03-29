import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  configure(configJson: string): void;
  syncProducts(): Promise<string>;
  getProducts(): Promise<string>;
  clearProducts(): Promise<void>;
}

export default TurboModuleRegistry.get<Spec>('ProductSync');
