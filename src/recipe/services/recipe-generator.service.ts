import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecipeGeneratorConfig } from '../../config/recipe-generator.config';
import { GcpHttpService } from '../../providers/gcp/services/gcp-http.service';
import { GeneratedRecipeDto } from '../dtos/generated-recipe.dto';
import { AppLogger } from '../../providers/logger/logger.service';
import { RecipeMetadataDto } from '../dtos/recipe-metadata.dto';
import { AbortRecipeDto } from '../dtos/abort-recipe.dto';

@Injectable()
export class RecipeGeneratorService {
  private readonly serviceUrl: string;

  constructor(
    private configService: ConfigService,
    private gcpHttpService: GcpHttpService,
    private logger: AppLogger,
  ) {
    this.logger.setContext(RecipeGeneratorService.name);
    const { url } = this.configService.getOrThrow<RecipeGeneratorConfig>('recipeGeneratorConfig');
    this.serviceUrl = url;
  }

  /**
   * Send request to Recipe Generator service with the metadata retrieved from instagram and get back generated recipe
   */
  async generateFromInstagram(metadata: RecipeMetadataDto): Promise<GeneratedRecipeDto> {
    const requestUrl = `${this.serviceUrl}/generateFromInstagram`;

    return this.gcpHttpService.request<GeneratedRecipeDto>(this.serviceUrl, {
      url: requestUrl,
      method: 'POST',
      data: {
        metadata,
        // TODO: Should be Dynamic
        targetLanguage: 'Russian',
        useMetricSystem: true,
      },
    });
  }

  async getInstagramPostMetadata(postUrl: string): Promise<RecipeMetadataDto> {
    const requestUrl = `${this.serviceUrl}/getInstagramPostMetadata`;

    return this.gcpHttpService.request<RecipeMetadataDto>(this.serviceUrl, {
      url: requestUrl,
      method: 'POST',
      data: {
        postUrl,
      },
    });
  }

  async deleteRecipeVideo(data: AbortRecipeDto): Promise<void> {
    const requestUrl = `${this.serviceUrl}/deleteRecipeVideo`;

    await this.gcpHttpService.request<RecipeMetadataDto>(this.serviceUrl, {
      url: requestUrl,
      method: 'POST',
      data,
    });
  }
}
