# 🍳 PantryChef AI - Production-Ready Base Mini App

**Your Personal AI Chef: Delicious Recipes from What You Have**

![PantryChef AI](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Base](https://img.shields.io/badge/Base-Blockchain-blue)

## ✨ Features

### Core Functionality
- 🥘 **Smart Ingredient Input**: Add ingredients to your virtual pantry via chat interface
- 🎯 **Granular Dietary Profiling**: Set dietary preferences and allergies for personalized recipes
- 🤖 **AI-Powered Recipe Generation**: Get unique recipes based on your ingredients and preferences
- ❤️ **Recipe Management**: Save, search, and organize your favorite recipes with advanced filtering
- 🔄 **Recipe Customization**: Modify and personalize recipes based on your preferences

### Blockchain & Payments
- 💳 **On-chain Payments**: USDC payments on Base blockchain with secure wallet integration
- 🔐 **Wallet Integration**: Seamless connection with OnchainKit and MiniKit
- 💰 **Flexible Pricing**: Pay-per-recipe or subscription models (daily/weekly passes)
- 🆓 **Freemium Model**: 3 free recipes daily, then paid tiers

### Production Features
- 📱 **Mobile-First Design**: Optimized for Telegram Mini App experience
- 🎨 **Modern UI/UX**: Glass morphism design with smooth animations and micro-interactions
- ⚡ **Performance Optimized**: Fast loading, efficient state management, and optimized bundle size
- 🔒 **Production Security**: Environment-based configuration, secure API handling, input validation
- 📊 **Usage Analytics**: Built-in tracking for recipe generation, user engagement, and payments
- 🌐 **Responsive Design**: Works seamlessly across all device sizes and orientations

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

## 💰 Business Model & Pricing

### Pricing Tiers
- **Free Tier**: 3 recipes per day
- **Single Recipe**: $0.0001 USDC per recipe
- **Daily Pass**: $0.001 USDC for unlimited recipes (24 hours)
- **Weekly Pass**: $0.005 USDC for unlimited recipes (7 days)

### Payment Flow
1. User connects wallet via OnchainKit
2. Selects payment option in modal
3. Confirms USDC transaction on Base
4. Receives recipe generation credits
5. Generates recipes based on subscription/credits

## 🚀 Production Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Configure environment variables in dashboard
3. Deploy automatically on push to main

### Environment Variables for Production
```env
# AI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# OnchainKit Configuration  
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Payment Configuration
NEXT_PUBLIC_PAYMENT_RECIPIENT_ADDRESS=your_payment_address
```

### Database Setup (Supabase)
```sql
-- Users table
CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  dietary_preferences TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  calorie_goal INTEGER,
  saved_recipes TEXT[] DEFAULT '{}',
  onchain_wallet_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Recipes table  
CREATE TABLE recipes (
  recipe_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients_used TEXT[] DEFAULT '{}',
  instructions TEXT,
  prep_time INTEGER DEFAULT 0,
  cook_time INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  saved_by_user_id TEXT[] DEFAULT '{}',
  calories INTEGER,
  servings INTEGER DEFAULT 4,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ingredients table
CREATE TABLE ingredients (
  ingredient_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality
- TypeScript strict mode enabled
- ESLint with Next.js recommended config
- Component-based architecture
- Comprehensive error handling

## 🎯 Roadmap

### ✅ Phase 1 (Complete)
- Core recipe generation with AI
- Payment integration with Base/USDC
- Recipe saving and management
- User preferences and dietary restrictions
- Production-ready UI/UX

### 🔄 Phase 2 (In Progress)
- Advanced recipe filtering and search
- Social features (recipe sharing)
- Nutrition analysis and tracking
- Meal planning capabilities

### 📋 Phase 3 (Planned)
- Multi-language support
- Voice input integration
- Community recipe marketplace
- Advanced AI personalization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

### Common Issues
- **API Key Errors**: Verify environment variables are set correctly
- **Wallet Connection**: Ensure OnchainKit is properly configured  
- **Recipe Generation**: Check OpenAI API quota and billing
- **Database Issues**: Verify Supabase connection and table structure

### Getting Help
- Check the Issues page for common problems
- Review the comprehensive documentation above
- Contact the development team

---

**Built with ❤️ for the Base ecosystem**

*PantryChef AI - Making cooking accessible, personalized, and fun through AI and blockchain technology.*
