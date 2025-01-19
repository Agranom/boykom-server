import { ConfigHelper } from './config.helper';

export interface RecipeGeneratorConfig {
  url: string;
}

export const recipeGeneratorConfig = (): RecipeGeneratorConfig => ({
  url: ConfigHelper.getOrThrow('RECIPE_GENERATOR_SERVICE_URL'),
});
