export interface User {
  user_id: string;
  dietary_preferences: string[];
  allergies: string[];
  calorie_goal?: number;
  saved_recipes: string[];
  onchain_wallet_address?: string;
}

export interface Ingredient {
  ingredient_id: string;
  name: string;
  user_id: string;
}

export interface Recipe {
  recipe_id: string;
  title: string;
  description: string;
  ingredients_used: string[];
  instructions: string;
  prep_time: number;
  cook_time: number;
  tags: string[];
  saved_by_user_id: string[];
  calories?: number;
  servings?: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'info';
  content: string;
  timestamp: Date;
  recipe?: Recipe;
}

export interface DietaryPreference {
  id: string;
  name: string;
  description: string;
}

export interface GenerateRecipeRequest {
  ingredients: string[];
  dietary_preferences: string[];
  allergies: string[];
  calorie_goal?: number;
  cuisine_preference?: string;
  meal_type?: string;
}
