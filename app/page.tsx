'use client';

import { useState, useEffect, useRef } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Address } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { ChatInput } from '@/components/ChatInput';
import { ChatMessage } from '@/components/ChatMessage';
import { IngredientList } from '@/components/IngredientList';
import { UserSettings } from '@/components/UserSettings';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PaymentModal } from '@/components/PaymentModal';
import { SavedRecipes } from '@/components/SavedRecipes';
import { generateRecipe } from '@/lib/openai';
import { ChatMessage as ChatMessageType, User, Recipe } from '@/lib/types';
import { 
  canGenerateRecipe, 
  updateFreeTierUsage, 
  createSubscription,
  FREE_TIER_DAILY_LIMIT,
  type FreeTierUsage,
  type Subscription 
} from '@/lib/payments';
import { Settings2, ChefHat, Sparkles, Heart, Crown } from 'lucide-react';

export default function PantryChefApp() {
  const { setFrameReady } = useMiniKit();
  const { address } = useAccount();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State management
  const [user, setUser] = useState<User>({
    user_id: 'demo_user',
    dietary_preferences: [],
    allergies: [],
    saved_recipes: [],
  });

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [savedRecipesList, setSavedRecipesList] = useState<Recipe[]>([]);
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Welcome to PantryChef AI! I'm your personal AI chef. Start by adding ingredients to your pantry using the + button, then I'll help you create amazing recipes!",
      timestamp: new Date(),
    }
  ]);

  // UI State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSavedRecipesOpen, setIsSavedRecipesOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Payment & Subscription State
  const [freeTierUsage, setFreeTierUsage] = useState<FreeTierUsage>({
    userId: 'demo_user',
    recipesGenerated: 0,
    lastResetDate: new Date(),
    dailyLimit: FREE_TIER_DAILY_LIMIT,
  });
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Initialize MiniKit
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add ingredient to pantry
  const handleAddIngredient = (ingredient: string) => {
    if (!ingredients.includes(ingredient.toLowerCase())) {
      const newIngredients = [...ingredients, ingredient.toLowerCase()];
      setIngredients(newIngredients);
      
      addMessage({
        type: 'info',
        content: `Added "${ingredient}" to your pantry! 🥘`,
      });

      // Suggest recipe generation if we have enough ingredients
      if (newIngredients.length >= 3) {
        setTimeout(() => {
          addMessage({
            type: 'bot',
            content: `Great! You now have ${newIngredients.length} ingredients. Would you like me to generate a recipe? Just type "generate recipe" or tell me what kind of meal you're in the mood for!`,
          });
        }, 1000);
      }
    } else {
      addMessage({
        type: 'info',
        content: `"${ingredient}" is already in your pantry! 📦`,
      });
    }
  };

  // Remove ingredient from pantry
  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
    addMessage({
      type: 'info',
      content: `Removed "${ingredient}" from your pantry`,
    });
  };

  // Add message to chat
  const addMessage = (message: Omit<ChatMessageType, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessageType = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Handle user messages
  const handleSendMessage = async (content: string) => {
    addMessage({ type: 'user', content });

    const lowerContent = content.toLowerCase();

    // Check for recipe generation requests
    if (lowerContent.includes('recipe') || lowerContent.includes('cook') || lowerContent.includes('make')) {
      if (ingredients.length === 0) {
        addMessage({
          type: 'bot',
          content: "I'd love to help you create a recipe! But first, please add some ingredients to your pantry using the + button. What ingredients do you have available?",
        });
        return;
      }

      await generateRecipeFromChat(content);
      return;
    }

    // Check for settings requests
    if (lowerContent.includes('setting') || lowerContent.includes('preference') || lowerContent.includes('diet')) {
      addMessage({
        type: 'bot',
        content: "I can help you update your dietary preferences and restrictions! Click the settings button (⚙️) at the top right to customize your profile.",
      });
      return;
    }

    // Check for help requests
    if (lowerContent.includes('help') || lowerContent.includes('how')) {
      addMessage({
        type: 'bot',
        content: `Here's how to use PantryChef AI:

🥘 **Add Ingredients**: Use the + button to add ingredients to your pantry
⚙️ **Settings**: Click the settings icon to set dietary preferences and allergies
🍳 **Generate Recipes**: Once you have ingredients, ask me to create a recipe!
💾 **Save Recipes**: Save your favorite recipes by clicking the heart icon

Try saying "generate a recipe" or "make something Italian" to get started!`,
      });
      return;
    }

    // Default response
    addMessage({
      type: 'bot',
      content: "I'm here to help you create amazing recipes! Add some ingredients to your pantry and ask me to generate a recipe. You can also ask for help or update your settings anytime! 👨‍🍳",
    });
  };

  // Check if user can generate recipe (free tier or subscription)
  const checkRecipeGeneration = (): boolean => {
    return canGenerateRecipe(freeTierUsage, subscription || undefined);
  };

  // Handle payment success
  const handlePaymentSuccess = (transactionHash: string, type: string) => {
    if (type === 'recipe') {
      // Single recipe payment - proceed with generation
      generateRecipeFromChat('generate recipe', true);
    } else {
      // Subscription payment - create subscription
      const newSubscription = createSubscription(
        user.user_id,
        type as 'daily' | 'weekly',
        transactionHash
      );
      setSubscription(newSubscription);
      
      addMessage({
        type: 'info',
        content: `🎉 ${type === 'daily' ? 'Daily' : 'Weekly'} subscription activated! You now have unlimited recipe generation. Transaction: ${transactionHash.slice(0, 10)}...`,
      });
    }
  };

  // Generate recipe from chat
  const generateRecipeFromChat = async (userMessage: string, skipPaymentCheck = false) => {
    if (ingredients.length === 0) {
      addMessage({
        type: 'bot',
        content: "Please add some ingredients to your pantry first! Use the + button to add ingredients.",
      });
      return;
    }

    // Check if user can generate recipe (unless payment was just made)
    if (!skipPaymentCheck && !checkRecipeGeneration()) {
      const remaining = freeTierUsage.dailyLimit - freeTierUsage.recipesGenerated;
      addMessage({
        type: 'bot',
        content: `You've used all ${freeTierUsage.dailyLimit} free recipes for today! Choose a payment option to continue generating recipes.`,
      });
      setIsPaymentModalOpen(true);
      return;
    }

    setIsGenerating(true);
    
    addMessage({
      type: 'bot',
      content: "🧑‍🍳 Let me create a personalized recipe for you using your ingredients and preferences...",
    });

    try {
      // Extract preferences from user message
      const lowerMessage = userMessage.toLowerCase();
      let cuisine_preference = '';
      let meal_type = '';

      // Simple keyword detection for cuisine
      if (lowerMessage.includes('italian')) cuisine_preference = 'Italian';
      else if (lowerMessage.includes('mexican')) cuisine_preference = 'Mexican';
      else if (lowerMessage.includes('asian')) cuisine_preference = 'Asian';
      else if (lowerMessage.includes('indian')) cuisine_preference = 'Indian';

      // Simple keyword detection for meal type
      if (lowerMessage.includes('breakfast')) meal_type = 'Breakfast';
      else if (lowerMessage.includes('lunch')) meal_type = 'Lunch';
      else if (lowerMessage.includes('dinner')) meal_type = 'Dinner';
      else if (lowerMessage.includes('snack')) meal_type = 'Snack';

      const recipe = await generateRecipe({
        ingredients,
        dietary_preferences: user.dietary_preferences,
        allergies: user.allergies,
        calorie_goal: user.calorie_goal,
        cuisine_preference,
        meal_type,
      });

      // Update free tier usage if not on subscription
      if (!subscription || !subscription.isActive) {
        setFreeTierUsage(updateFreeTierUsage(freeTierUsage));
      }

      addMessage({
        type: 'bot',
        content: `🎉 I've created a delicious recipe for you! Here's "${recipe.title}" using your available ingredients:`,
        recipe,
      });

    } catch (error) {
      console.error('Error generating recipe:', error);
      addMessage({
        type: 'bot',
        content: "Sorry, I had trouble generating a recipe. Please try again! Make sure you have a stable internet connection.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Save recipe
  const handleSaveRecipe = (recipeId: string) => {
    // Find the recipe in messages
    const recipeMessage = messages.find(msg => msg.recipe?.recipe_id === recipeId);
    if (!recipeMessage?.recipe) return;

    if (!user.saved_recipes.includes(recipeId)) {
      // Add to user's saved recipes list
      setUser({
        ...user,
        saved_recipes: [...user.saved_recipes, recipeId],
      });
      
      // Add to saved recipes list for the modal
      setSavedRecipesList(prev => [...prev, recipeMessage.recipe!]);
      
      addMessage({
        type: 'info',
        content: "Recipe saved to your collection! ❤️",
      });
    }
  };

  // Remove recipe from saved list
  const handleRemoveRecipe = (recipeId: string) => {
    setUser({
      ...user,
      saved_recipes: user.saved_recipes.filter(id => id !== recipeId),
    });
    
    setSavedRecipesList(prev => prev.filter(recipe => recipe.recipe_id !== recipeId));
    
    addMessage({
      type: 'info',
      content: "Recipe removed from your collection",
    });
  };

  // Update user settings
  const handleUpdateUser = (updates: Partial<User>) => {
    setUser({ ...user, ...updates });
    addMessage({
      type: 'info',
      content: "Settings updated successfully! 🎯",
    });
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="glass-card p-4 m-4 mb-0 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <ChefHat size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PantryChef AI</h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-300">Your Personal AI Chef</p>
                {subscription && subscription.isActive && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-0.5 rounded-full">
                    <Crown size={12} className="text-white" />
                    <span className="text-xs text-white font-medium">
                      {subscription.type === 'daily' ? 'Daily' : 'Weekly'} Pro
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Free Recipes Counter */}
            {(!subscription || !subscription.isActive) && (
              <div className="text-center px-2">
                <div className="text-xs text-gray-400">Free Recipes</div>
                <div className="text-sm font-bold text-accent">
                  {Math.max(0, freeTierUsage.dailyLimit - freeTierUsage.recipesGenerated)}/{freeTierUsage.dailyLimit}
                </div>
              </div>
            )}

            {/* Saved Recipes Button */}
            <button
              onClick={() => setIsSavedRecipesOpen(true)}
              className="p-2 glass-card rounded-lg hover:bg-opacity-15 transition-all duration-200 relative"
            >
              <Heart size={20} className="text-white" />
              {savedRecipesList.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {savedRecipesList.length}
                </div>
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 glass-card rounded-lg hover:bg-opacity-15 transition-all duration-200"
            >
              <Settings2 size={20} className="text-white" />
            </button>
            
            {/* Wallet Connection */}
            <Wallet>
              <ConnectWallet>
                <Name />
              </ConnectWallet>
            </Wallet>
          </div>
        </div>
      </header>

      {/* Ingredients Panel */}
      <div className="p-4 pb-0">
        <IngredientList
          ingredients={ingredients}
          onRemoveIngredient={handleRemoveIngredient}
        />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onSaveRecipe={handleSaveRecipe}
          />
        ))}
        
        {isGenerating && (
          <div className="flex justify-center py-4">
            <div className="glass-card p-4 rounded-lg flex items-center gap-3">
              <LoadingSpinner />
              <span className="text-white">Creating your recipe...</span>
              <Sparkles size={16} className="text-accent animate-pulse" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onAddIngredient={handleAddIngredient}
        placeholder="Ask me to create a recipe or add ingredients..."
        disabled={isGenerating}
      />

      {/* Settings Modal */}
      <UserSettings
        user={user}
        onUpdateUser={handleUpdateUser}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        userAddress={address}
        recipesRemaining={Math.max(0, freeTierUsage.dailyLimit - freeTierUsage.recipesGenerated)}
      />

      {/* Saved Recipes Modal */}
      <SavedRecipes
        isOpen={isSavedRecipesOpen}
        onClose={() => setIsSavedRecipesOpen(false)}
        savedRecipes={savedRecipesList}
        onRemoveRecipe={handleRemoveRecipe}
      />
    </div>
  );
}
