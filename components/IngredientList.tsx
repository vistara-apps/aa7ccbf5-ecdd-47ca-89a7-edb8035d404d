'use client';

import { X } from 'lucide-react';

interface IngredientListProps {
  ingredients: string[];
  onRemoveIngredient: (ingredient: string) => void;
  title?: string;
}

export function IngredientList({ 
  ingredients, 
  onRemoveIngredient, 
  title = "Your Pantry" 
}: IngredientListProps) {
  if (ingredients.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <h3 className="font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">
          No ingredients added yet. Use the + button to add ingredients!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold text-white mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="ingredient-tag flex items-center gap-2 group"
          >
            <span>{ingredient}</span>
            <button
              onClick={() => onRemoveIngredient(ingredient)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-400"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
        <p className="text-xs text-gray-400">
          {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} ready for cooking
        </p>
      </div>
    </div>
  );
}
