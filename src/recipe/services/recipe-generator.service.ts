import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecipeGeneratorConfig } from '../../config/recipe-generator.config';
import { GcpHttpService } from '../../providers/gcp/services/gcp-http.service';
import { GeneratedRecipeDto } from '../dtos/generated-recipe.dto';
import { AppLogger } from '../../providers/logger/logger.service';

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
   * Send request to Recipe Generator service with instagram url and get back generated recipe
   * @param postUrl
   */
  async generateFromInstagram(postUrl: string): Promise<GeneratedRecipeDto> {
    const requestUrl = `${this.serviceUrl}/generate/instagram`;

    return this.gcpHttpService.request<GeneratedRecipeDto>(this.serviceUrl, {
      url: requestUrl,
      method: 'POST',
      data: {
        url: postUrl,
        targetLanguage: 'Russian',
        useMetricSystem: true,
      },
    });
  }
}
