import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable, OnModuleInit } from '@nestjs/common';
import Fuse, { IFuseOptions } from 'fuse.js';
import { z } from 'zod';
import { AppLogger } from '../../providers/logger/logger.service';
import { groceryCategories } from '../const/grocery-categories';
import {
  eGroceryCategory,
  eGroceryCategoryLanguage,
  IGroceryStorageItem,
} from '../interfaces/grocery-category.interface';
import { GroceryStorageService } from './grocery-storage.service';

// eslint-disable-next-line
const FuseClient = require('fuse.js');

@Injectable()
export class GroceryCategoriesService implements OnModuleInit {
  private fuseClient: Fuse<IGroceryStorageItem>;
  private readonly fuseOptions: IFuseOptions<IGroceryStorageItem> = {
    keys: ['groceryName'],
    threshold: 0.2,
    ignoreLocation: true,
  };
  private readonly llm: ChatOpenAI;

  // Connect to gloud function and fetch categories on server init

  constructor(private logger: AppLogger, private groceryStorageService: GroceryStorageService) {
    this.logger.setContext(GroceryCategoriesService.name);

    this.llm = new ChatOpenAI({
      temperature: 0,
      model: 'gpt-4o-mini',
      timeout: 2000,
    });
  }

  async onModuleInit(): Promise<void> {
    this.validateCategories();

    await this.loadCategories();
  }

  async getCategory(groceryName: string): Promise<eGroceryCategory> {
    try {
      const [result] = this.fuseClient.search(groceryName.trim(), { limit: 1 });
      if (!result) {
        const newCategory: IGroceryStorageItem = await this.generateCategory(groceryName);

        this.insertGroceryWithCategory(newCategory);

        return newCategory.category;
      }

      return result.item.category;
    } catch (e) {
      this.logger.error(`Couldn't get category.`, e.message);

      return eGroceryCategory.Unknown;
    }
  }

  private async loadCategories(): Promise<void> {
    let items: IGroceryStorageItem[] = [];

    try {
      items = await this.groceryStorageService.getAll();

      this.logger.log(`Groceries with categories are loaded, count: ${items.length}`);
    } catch (e) {
      this.logger.error(`Couldn't get grocery with categories`, e);
    }

    this.fuseClient = new FuseClient(items, this.fuseOptions);
  }

  /**
   * Uses GenAI tagging feature in order to generate an appropriate category by grocery name
   * @param groceryName
   * @private
   */
  private async generateCategory(groceryName: string): Promise<IGroceryStorageItem> {
    const taggingPrompt = ChatPromptTemplate.fromTemplate(
      `Extract the desired information from the following passage.

                Only extract the properties mentioned in the 'Classification' function.
                
                Passage:
                {input}
              `,
    );

    const classificationSchema = z.object({
      name: z.string().describe('The singular original grocery name in given language'),
      category: z.enum(groceryCategories).describe(
        `
          One of the grocery's category from the list:
          - Fruits - apple, banana, orange, .etc;
          - Vegetables - cucumber, tomato, carrot, .etc;
          - HouseholdGoods - dish soap, laundry detergent, trash bags, .etc;
          - PersonalCare - shampoo, toothpaste, deodorant, .etc;
          - Dairy - milk, cheese, yogurt, .etc;
          - Meat - chicken, beef, pork, .etc;
          - Seafood - salmon, shrimp, tuna, .etc;
          - PantryStaples - rice, pasta, flour, .etc;
          - CannedGoods - canned tuna, canned corn, canned tomatoes, .etc;
          - Bakery - bread, bagel, croissant, .etc;
          - Beverages - water, soda, juice, .etc;
          - Alcohol - beer, whiskey, vodka, .etc;
          - Spices - salt, black pepper, paprika, .etc;
          - Oils - olive oil, sunflower oil, sesame oil, .etc;
          - HygieneProducts - toilet paper, soap, wet wipes, .etc;
          
          Translate input text into english if needed in order to extract the category.
           `,
      ),
      language: z
        .enum([
          eGroceryCategoryLanguage.EN,
          eGroceryCategoryLanguage.RU,
          eGroceryCategoryLanguage.UA,
        ])
        .describe('The language the text is written in'),
    });

    const llmWihStructuredOutput = this.llm.withStructuredOutput(classificationSchema, {
      name: 'extractor',
    });

    const chain = taggingPrompt.pipe(llmWihStructuredOutput);
    const result = await chain.invoke({ input: groceryName });

    return { category: result.category, language: result.language, groceryName: result.name };
  }

  private async insertGroceryWithCategory(item: IGroceryStorageItem): Promise<void> {
    try {
      // Inserting to category storage service
      await this.groceryStorageService.addItem(item);
      this.logger.log(`Inserted: ${JSON.stringify(item)}`);

      await this.loadCategories();
    } catch (e) {
      this.logger.error(`Couldn't insert item: ${e.message}`);
    }
  }

  private validateCategories(): void {
    this.logger.log('Validating categories');

    const enumValues = Object.values(eGroceryCategory);
    const isSameSize = enumValues.length === groceryCategories.length;
    const isSameValues = groceryCategories.some((val) => enumValues.includes(val));

    if (!isSameSize || !isSameValues) {
      this.logger.error(`Categories are invalid: ${JSON.stringify({ isSameSize, isSameValues })}`);

      throw new Error(`Grocery Categories Changed`);
    }

    this.logger.log('Categories are valid');
  }
}
