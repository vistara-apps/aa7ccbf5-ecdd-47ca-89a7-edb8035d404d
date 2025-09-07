import { createClient } from '@supabase/supabase-js';
import { User, Recipe, Ingredient } from './types';

// Initialize Supabase client only when needed to avoid build-time errors
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not found. Database features will be disabled.');
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

export const supabase = getSupabaseClient();

// User management
export async function createUser(user: User): Promise<User | null> {
  if (!supabase) {
    console.warn('Supabase not initialized. Cannot create user.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function getUser(userId: string): Promise<User | null> {
  if (!supabase) {
    console.warn('Supabase not initialized. Cannot get user.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  if (!supabase) {
    console.warn('Supabase not initialized. Cannot update user.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

// Recipe management
export async function saveRecipe(recipe: Recipe): Promise<Recipe | null> {
  if (!supabase) {
    console.warn('Supabase not initialized. Cannot save recipe.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('recipes')
      .insert([recipe])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving recipe:', error);
    return null;
  }
}

export async function getUserRecipes(userId: string): Promise<Recipe[]> {
  if (!supabase) {
    console.warn('Supabase not initialized. Cannot get user recipes.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .contains('saved_by_user_id', [userId]);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    return [];
  }
}

export async function addRecipeToUser(userId: string, recipeId: string): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not initialized. Cannot add recipe to user.');
    return false;
  }

  try {
    // First get the current recipe
    const { data: recipe, error: fetchError } = await supabase
      .from('recipes')
      .select('saved_by_user_id')
      .eq('recipe_id', recipeId)
      .single();

    if (fetchError) throw fetchError;

    // Add user to saved_by_user_id array if not already present
    const currentSavedBy = recipe.saved_by_user_id || [];
    if (!currentSavedBy.includes(userId)) {
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ saved_by_user_id: [...currentSavedBy, userId] })
        .eq('recipe_id', recipeId);

      if (updateError) throw updateError;
    }

    return true;
  } catch (error) {
    console.error('Error adding recipe to user:', error);
    return false;
  }
}

// Ingredient management
export async function saveIngredient(ingredient: Ingredient): Promise<Ingredient | null> {
  if (!supabase) {
    console.warn('Supabase not initialized. Cannot save ingredient.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('ingredients')
      .insert([ingredient])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving ingredient:', error);
    return null;
  }
}

export async function getUserIngredients(userId: string): Promise<Ingredient[]> {
  if (!supabase) {
    console.warn('Supabase not initialized. Cannot get user ingredients.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user ingredients:', error);
    return [];
  }
}

export async function deleteIngredient(ingredientId: string): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not initialized. Cannot delete ingredient.');
    return false;
  }

  try {
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('ingredient_id', ingredientId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    return false;
  }
}

// Database initialization (for development)
export async function initializeDatabase() {
  if (!supabase) {
    console.warn('Supabase not initialized. Cannot initialize database.');
    return;
  }

  try {
    // Create users table
    await supabase.rpc('create_users_table');
    
    // Create recipes table
    await supabase.rpc('create_recipes_table');
    
    // Create ingredients table
    await supabase.rpc('create_ingredients_table');
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
