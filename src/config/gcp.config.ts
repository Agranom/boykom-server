import { ConfigHelper } from './config.helper';

export interface GcpConfig {
  serviceAccountKey: string;
}

export const gcpConfig = (): GcpConfig => ({
  serviceAccountKey: ConfigHelper.getOrThrow('GROCERY_STORAGE_SERVICE_ACCOUNT'),
});
