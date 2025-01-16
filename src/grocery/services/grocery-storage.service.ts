import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GroceryStorageConfig } from '../../config/grocery-storage.config';
import { IGroceryStorageItem } from '../interfaces/grocery-category.interface';
import { GcpHttpService } from '../../providers/gcp/services/gcp-http.service';

@Injectable()
export class GroceryStorageService {
  private readonly serviceUrl: string;

  constructor(private configService: ConfigService, private gcpHttpService: GcpHttpService) {
    const { url } = this.configService.getOrThrow<GroceryStorageConfig>('groceryStorageConfig');
    this.serviceUrl = url;
  }

  async getAll(): Promise<IGroceryStorageItem[]> {
    const { data } = await this.gcpHttpService.request<{ data: IGroceryStorageItem[] }>(
      this.serviceUrl,
      {
        url: this.serviceUrl,
        method: 'GET',
      },
    );

    return data;
  }

  async addItem(item: IGroceryStorageItem): Promise<void> {
    await this.gcpHttpService.request(this.serviceUrl, {
      url: this.serviceUrl,
      method: 'POST',
      data: item,
    });
  }
}
