import { Injectable } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { GaxiosOptions } from 'gaxios/build/src/common';
import { GcpConfig } from '../../../config/gcp.config';

@Injectable()
export class GcpHttpService {
  private gAuth: GoogleAuth;

  constructor(private configService: ConfigService) {
    const { serviceAccountKey } = this.configService.getOrThrow<GcpConfig>('gcpConfig');

    this.gAuth = this.getGoogleAuth(serviceAccountKey);
  }

  async request<T>(serviceUrl: string, options: GaxiosOptions): Promise<T> {
    const client = await this.gAuth.getIdTokenClient(serviceUrl);

    const { data } = await client.request<T>({
      ...options,
      responseType: 'json',
    });

    return data;
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
