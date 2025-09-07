import { NextRequest, NextResponse } from 'next/server';
import { saveRecipe, addRecipeToUser } from '@/lib/supabase';
import { Recipe } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { recipe, userId }: { recipe: Recipe; userId: string } = await request.json();
    
    // Validate required fields
    if (!recipe || !userId) {
      return NextResponse.json(
        { error: 'Recipe and userId are required' },
        { status: 400 }
      );
    }

    // Save recipe to database
    const savedRecipe = await saveRecipe(recipe);
    if (!savedRecipe) {
      return NextResponse.json(
        { error: 'Failed to save recipe' },
        { status: 500 }
      );
    }

    // Add recipe to user's saved list
    const success = await addRecipeToUser(userId, recipe.recipe_id);
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to add recipe to user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      recipe: savedRecipe,
      message: 'Recipe saved successfully' 
    });
  } catch (error) {
    console.error('Error saving recipe:', error);
    return NextResponse.json(
      { error: 'Failed to save recipe' },
      { status: 500 }
    );
  }
}
