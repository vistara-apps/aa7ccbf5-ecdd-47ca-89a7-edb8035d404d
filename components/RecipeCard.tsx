'use client';

import { Recipe } from '@/lib/types';
import { Clock, Users, Heart, Zap } from 'lucide-react';
import { useState } from 'react';

interface RecipeCardProps {
  recipe: Recipe;
  variant?: 'compact' | 'detailed';
  onSave?: (recipeId: string) => void;
  onGenerate?: (recipeId: string) => void;
  isSaved?: boolean;
  showSaveButton?: boolean;
}

export function RecipeCard({ 
  recipe, 
  variant = 'compact', 
  onSave, 
  onGenerate,
  isSaved = false,
  showSaveButton = true
}: RecipeCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!onGenerate) return;
    
    setIsGenerating(true);
    try {
      await onGenerate(recipe.recipe_id);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(recipe.recipe_id);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="recipe-card">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-white">{recipe.title}</h3>
          {onSave && (
            <button
              onClick={handleSave}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isSaved 
                  ? 'text-pink-400 bg-pink-400 bg-opacity-20' 
                  : 'text-gray-400 hover:text-pink-400'
              }`}
            >
              <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
        
        <p className="text-gray-300 text-sm mb-3">{recipe.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{recipe.prep_time + recipe.cook_time}min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{recipe.servings} servings</span>
          </div>
          {recipe.calories && (
            <div className="flex items-center gap-1">
              <Zap size={14} />
              <span>{recipe.calories} cal</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="ingredient-tag text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-xl text-white">{recipe.title}</h3>
        {onSave && showSaveButton && (
          <button
            onClick={handleSave}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isSaved 
                ? 'text-pink-400 bg-pink-400 bg-opacity-20' 
                : 'text-gray-400 hover:text-pink-400'
            }`}
          >
            <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      
      <p className="text-gray-300 mb-4">{recipe.description}</p>
      
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div className="glass-card p-3 rounded-lg">
          <Clock size={20} className="mx-auto mb-1 text-accent" />
          <p className="text-xs text-gray-400">Prep</p>
          <p className="text-sm font-semibold text-white">{recipe.prep_time}min</p>
        </div>
        <div className="glass-card p-3 rounded-lg">
          <Users size={20} className="mx-auto mb-1 text-accent" />
          <p className="text-xs text-gray-400">Serves</p>
          <p className="text-sm font-semibold text-white">{recipe.servings}</p>
        </div>
        {recipe.calories && (
          <div className="glass-card p-3 rounded-lg">
            <Zap size={20} className="mx-auto mb-1 text-accent" />
            <p className="text-xs text-gray-400">Calories</p>
            <p className="text-sm font-semibold text-white">{recipe.calories}</p>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold text-white mb-2">Ingredients:</h4>
        <div className="flex flex-wrap gap-2">
          {recipe.ingredients_used.map((ingredient, index) => (
            <span key={index} className="ingredient-tag">
              {ingredient}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold text-white mb-2">Instructions:</h4>
        <div className="glass-card p-4 rounded-lg">
          <p className="text-gray-300 text-sm whitespace-pre-line">{recipe.instructions}</p>
        </div>
      </div>
      
      {recipe.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span key={tag} className="ingredient-tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {onGenerate && (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating Recipe...' : 'Generate Full Recipe ($0.20)'}
        </button>
      )}
    </div>
  );
}
