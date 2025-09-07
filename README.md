# PantryChef AI - Base Mini App

Your Personal AI Chef: Delicious Recipes from What You Have.

## Features

- 🥘 **Smart Ingredient Input**: Add ingredients to your virtual pantry via chat interface
- 🎯 **Granular Dietary Profiling**: Set dietary preferences and allergies for personalized recipes
- 🤖 **AI-Powered Recipe Generation**: Get unique recipes based on your ingredients and preferences
- ❤️ **Recipe Saving**: Save your favorite recipes for easy access
- 💳 **Base Integration**: Built on Base blockchain with OnchainKit integration
- 📱 **Mobile-First Design**: Optimized for Telegram Mini App experience

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit & MiniKit)
- **AI**: OpenAI API with Gemini 2.0 Flash model
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety throughout

## Getting Started

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env.local` and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```

3. **Required API Keys**:
   - `OPENAI_API_KEY` or `OPENROUTER_API_KEY`: For AI recipe generation
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: For Base blockchain integration

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Open**: Navigate to `http://localhost:3000`

## Usage

1. **Add Ingredients**: Use the + button to add ingredients to your pantry
2. **Set Preferences**: Click the settings icon to configure dietary preferences and allergies
3. **Generate Recipes**: Ask the AI to create recipes using your ingredients
4. **Save Favorites**: Click the heart icon to save recipes you love
5. **Connect Wallet**: Use the wallet connection for future payment features

## Architecture

### Core Components

- `ChatInput`: Handles user input and ingredient addition
- `ChatMessage`: Displays chat messages and recipe cards
- `RecipeCard`: Shows recipe details with save/generate options
- `IngredientList`: Manages pantry ingredients
- `UserSettings`: Configures dietary preferences and restrictions

### Data Flow

1. User adds ingredients via chat interface
2. AI processes ingredients + user preferences
3. OpenAI generates personalized recipes
4. Recipes displayed with save/customize options
5. Base integration for future payment features

## Design System

- **Colors**: Purple/blue gradient background with glass morphism
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Reusable UI components with consistent styling
- **Animations**: Smooth transitions and micro-interactions
- **Mobile-First**: Optimized for mobile Telegram experience

## Future Enhancements

- [ ] Supabase backend integration for data persistence
- [ ] Payment integration for premium recipe generation
- [ ] Recipe sharing and community features
- [ ] Advanced dietary analysis and nutrition tracking
- [ ] Voice input for hands-free cooking
- [ ] Recipe video generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
