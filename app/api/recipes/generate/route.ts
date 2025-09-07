import { NextRequest, NextResponse } from 'next/server';
import { generateRecipe } from '@/lib/openai';
import { GenerateRecipeRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRecipeRequest = await request.json();
    
    // Validate required fields
    if (!body.ingredients || body.ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Ingredients are required' },
        { status: 400 }
      );
    }

    // Generate recipe using OpenAI
    const recipe = await generateRecipe(body);
    
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error in recipe generation API:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}
