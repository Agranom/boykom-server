import { ConfigHelper } from './config.helper';

export interface GroceryStorageConfig {
  url: string;
  serviceAccountKey: string;
}

export const groceryStorageConfig = (): GroceryStorageConfig => ({
  url: ConfigHelper.getOrThrow('GROCERY_STORAGE_SERVICE_URL'),
  serviceAccountKey: ConfigHelper.getOrThrow('GROCERY_STORAGE_SERVICE_ACCOUNT'),
});
