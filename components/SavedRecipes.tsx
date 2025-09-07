'use client';

import { useState, useEffect } from 'react';
import { X, Heart, Clock, Users, Search, Filter, ChefHat } from 'lucide-react';
import { Recipe } from '@/lib/types';
import { RecipeCard } from './RecipeCard';
import { LoadingSpinner } from './LoadingSpinner';

interface SavedRecipesProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecipes: Recipe[];
  onRemoveRecipe?: (recipeId: string) => void;
  isLoading?: boolean;
}

export function SavedRecipes({ 
  isOpen, 
  onClose, 
  savedRecipes, 
  onRemoveRecipe,
  isLoading = false 
}: SavedRecipesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'quick' | 'healthy' | 'vegetarian'>('all');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(savedRecipes);

  useEffect(() => {
    let filtered = savedRecipes;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(recipe => {
        switch (selectedFilter) {
          case 'quick':
            return (recipe.prep_time + recipe.cook_time) <= 30;
          case 'healthy':
            return recipe.tags.some(tag => 
              ['healthy', 'low-calorie', 'nutritious', 'diet'].includes(tag.toLowerCase())
            );
          case 'vegetarian':
            return recipe.tags.some(tag => 
              ['vegetarian', 'vegan', 'plant-based'].includes(tag.toLowerCase())
            );
          default:
            return true;
        }
      });
    }

    setFilteredRecipes(filtered);
  }, [savedRecipes, searchTerm, selectedFilter]);

  if (!isOpen) return null;

  const filterOptions = [
    { id: 'all', label: 'All Recipes', count: savedRecipes.length },
    { 
      id: 'quick', 
      label: 'Quick (≤30min)', 
      count: savedRecipes.filter(r => (r.prep_time + r.cook_time) <= 30).length 
    },
    { 
      id: 'healthy', 
      label: 'Healthy', 
      count: savedRecipes.filter(r => 
        r.tags.some(tag => ['healthy', 'low-calorie', 'nutritious', 'diet'].includes(tag.toLowerCase()))
      ).length 
    },
    { 
      id: 'vegetarian', 
      label: 'Vegetarian', 
      count: savedRecipes.filter(r => 
        r.tags.some(tag => ['vegetarian', 'vegan', 'plant-based'].includes(tag.toLowerCase()))
      ).length 
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-xl max-w-4xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-2 rounded-lg">
              <Heart size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Saved Recipes</h2>
              <p className="text-sm text-gray-300">
                {savedRecipes.length} recipe{savedRecipes.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-600">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedFilter(option.id as any)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedFilter === option.id
                    ? 'bg-accent text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <LoadingSpinner />
                <p className="text-gray-300 mt-4">Loading your recipes...</p>
              </div>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                {savedRecipes.length === 0 ? (
                  <>
                    <ChefHat size={48} className="text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Saved Recipes</h3>
                    <p className="text-gray-400 mb-4">
                      Start generating recipes and save your favorites!
                    </p>
                    <button
                      onClick={onClose}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    >
                      Generate Recipe
                    </button>
                  </>
                ) : (
                  <>
                    <Filter size={48} className="text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Matching Recipes</h3>
                    <p className="text-gray-400">
                      Try adjusting your search or filter criteria
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.recipe_id} className="relative">
                  <RecipeCard
                    recipe={recipe}
                    variant="detailed"
                    onSave={() => {}} // Already saved
                    isSaved={true}
                    showSaveButton={false}
                  />
                  
                  {/* Remove Button */}
                  {onRemoveRecipe && (
                    <button
                      onClick={() => onRemoveRecipe(recipe.recipe_id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all duration-200"
                      title="Remove from saved recipes"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {filteredRecipes.length > 0 && (
          <div className="p-4 border-t border-gray-600 bg-gray-800 bg-opacity-50">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-4">
                <span>
                  Showing {filteredRecipes.length} of {savedRecipes.length} recipes
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Avg. {Math.round(
                    filteredRecipes.reduce((acc, r) => acc + r.prep_time + r.cook_time, 0) / 
                    filteredRecipes.length
                  )} min
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  Avg. {Math.round(
                    filteredRecipes.reduce((acc, r) => acc + (r.servings || 4), 0) / 
                    filteredRecipes.length
                  )} servings
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
