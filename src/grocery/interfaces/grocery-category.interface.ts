export enum eGroceryCategory {
  Fruits = 'fruits',
  Vegetables = 'vegetables',
  HouseholdGoods = 'household_goods',
  PersonalCare = 'personal_care',
  Dairy = 'dairy',
  Meat = 'meat',
  Seafood = 'seafood',
  PantryStaples = 'pantry_staples',
  CannedGoods = 'canned_goods',
  Bakery = 'bakery',
  Beverages = 'beverages',
  Alcohol = 'alcohol',
  Spices = 'spices',
  Oils = 'oils',
  HygieneProducts = 'hygiene_products',
  Unknown = 'unknown',
}

export enum eGroceryCategoryLanguage {
  EN = 'english',
  RU = 'russian',
  UA = 'ukrainian',
}

export interface IGroceryStorageItem {
  groceryName: string;
  category: eGroceryCategory;
  language: eGroceryCategoryLanguage;
}
