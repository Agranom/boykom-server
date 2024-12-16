import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GroceryStorageConfig } from '../../config/grocery-storage.config';
import { IGroceryStorageItem } from '../interfaces/grocery-category.interface';
import { GoogleAuth } from 'google-auth-library';

@Injectable()
export class GroceryStorageService {
  private readonly serviceUrl: string;
  private gAuth: GoogleAuth;

  constructor(private configService: ConfigService) {
    const { url, serviceAccountKey } =
      this.configService.getOrThrow<GroceryStorageConfig>('groceryStorageConfig');
    this.serviceUrl = url;

    this.gAuth = this.getGoogleAuth(serviceAccountKey);
  }

  async getAll(): Promise<IGroceryStorageItem[]> {
    const client = await this.gAuth.getIdTokenClient(this.serviceUrl);
    const { data } = await client.request<{ data: IGroceryStorageItem[] }>({
      url: this.serviceUrl,
      method: 'GET',
    });

    return data.data;
  }

  async addItem(item: IGroceryStorageItem): Promise<void> {
    const client = await this.gAuth.getIdTokenClient(this.serviceUrl);
    await client.request({
      url: this.serviceUrl,
      method: 'POST',
      data: item,
    });
  }

  private getGoogleAuth(serviceAccount: string): GoogleAuth {
    try {
      const credentials = JSON.parse(serviceAccount);

      return new GoogleAuth({ credentials });
    } catch {
      return new GoogleAuth({ keyFile: serviceAccount });
    }
  }
}
