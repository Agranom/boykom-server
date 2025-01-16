import { ConfigHelper } from './config.helper';

export interface GroceryStorageConfig {
  url: string;
}

export const groceryStorageConfig = (): GroceryStorageConfig => ({
  url: ConfigHelper.getOrThrow('GROCERY_STORAGE_SERVICE_URL'),
});
