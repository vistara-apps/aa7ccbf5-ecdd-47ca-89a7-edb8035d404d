import OpenAI from 'openai';
import { GenerateRecipeRequest, Recipe } from './types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateRecipe(request: GenerateRecipeRequest): Promise<Recipe> {
  const {
    ingredients,
    dietary_preferences,
    allergies,
    calorie_goal,
    cuisine_preference,
    meal_type
  } = request;

  const prompt = `
    Create a detailed recipe using the following parameters:
    
    Available Ingredients: ${ingredients.join(', ')}
    Dietary Preferences: ${dietary_preferences.join(', ') || 'None'}
    Allergies to Avoid: ${allergies.join(', ') || 'None'}
    ${calorie_goal ? `Target Calories: ${calorie_goal}` : ''}
    ${cuisine_preference ? `Cuisine Style: ${cuisine_preference}` : ''}
    ${meal_type ? `Meal Type: ${meal_type}` : ''}
    
    Please provide a recipe in the following JSON format:
    {
      "title": "Recipe Name",
      "description": "Brief description of the dish",
      "ingredients_used": ["ingredient1", "ingredient2"],
      "instructions": "Step-by-step cooking instructions",
      "prep_time": 15,
      "cook_time": 30,
      "servings": 4,
      "calories": 350,
      "tags": ["tag1", "tag2"]
    }
    
    Make sure to:
    - Only use ingredients from the available list or common pantry staples
    - Respect all dietary preferences and allergies
    - Provide clear, easy-to-follow instructions
    - Include realistic prep and cook times
    - Suggest appropriate tags for the recipe
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a professional chef AI that creates personalized recipes. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const recipeData = JSON.parse(content);
    
    // Create a complete Recipe object
    const recipe: Recipe = {
      recipe_id: `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: recipeData.title,
      description: recipeData.description,
      ingredients_used: recipeData.ingredients_used,
      instructions: recipeData.instructions,
      prep_time: recipeData.prep_time || 15,
      cook_time: recipeData.cook_time || 30,
      tags: recipeData.tags || [],
      saved_by_user_id: [],
      calories: recipeData.calories,
      servings: recipeData.servings || 4,
    };

    return recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    
    // Fallback recipe if AI fails
    return {
      recipe_id: `recipe_${Date.now()}_fallback`,
      title: 'Simple Ingredient Mix',
      description: 'A quick and easy dish using your available ingredients.',
      ingredients_used: ingredients.slice(0, 5),
      instructions: `1. Prepare your ingredients: ${ingredients.slice(0, 3).join(', ')}\n2. Combine ingredients in a pan\n3. Cook over medium heat for 10-15 minutes\n4. Season to taste\n5. Serve hot`,
      prep_time: 10,
      cook_time: 15,
      tags: ['quick', 'easy'],
      saved_by_user_id: [],
      calories: calorie_goal || 300,
      servings: 2,
    };
  }
}
