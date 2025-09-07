import { parseEther, formatEther } from 'viem';

// Payment configuration
export const PAYMENT_CONFIG = {
  RECIPE_GENERATION_COST: '0.0001', // ETH equivalent in USDC
  SUBSCRIPTION_DAILY_COST: '0.001',
  SUBSCRIPTION_WEEKLY_COST: '0.005',
  USDC_CONTRACT_ADDRESS: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
  BASE_CHAIN_ID: 8453,
};

export interface PaymentRequest {
  amount: string;
  recipient: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

// Mock payment function - in production, integrate with Turnkey/Privy
export async function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful payment
    return {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: 'Payment failed. Please try again.',
    };
  }
}

export async function createPaymentRequest(
  type: 'recipe' | 'daily_subscription' | 'weekly_subscription',
  userAddress: string
): Promise<PaymentRequest> {
  let amount: string;
  let description: string;

  switch (type) {
    case 'recipe':
      amount = PAYMENT_CONFIG.RECIPE_GENERATION_COST;
      description = 'Recipe Generation';
      break;
    case 'daily_subscription':
      amount = PAYMENT_CONFIG.SUBSCRIPTION_DAILY_COST;
      description = 'Daily Subscription - Unlimited Recipes';
      break;
    case 'weekly_subscription':
      amount = PAYMENT_CONFIG.SUBSCRIPTION_WEEKLY_COST;
      description = 'Weekly Subscription - Unlimited Recipes';
      break;
    default:
      throw new Error('Invalid payment type');
  }

  return {
    amount,
    recipient: process.env.NEXT_PUBLIC_PAYMENT_RECIPIENT_ADDRESS || '0x742d35Cc6634C0532925a3b8D0C9e3e0C0e0e0e0',
    description,
    metadata: {
      type,
      userAddress,
      timestamp: Date.now(),
    },
  };
}

export function formatPaymentAmount(amount: string): string {
  return `${amount} USDC`;
}

export function validatePaymentAmount(amount: string): boolean {
  try {
    const parsed = parseFloat(amount);
    return parsed > 0 && parsed <= 1; // Max 1 USDC per transaction
  } catch {
    return false;
  }
}

// Subscription management
export interface Subscription {
  userId: string;
  type: 'daily' | 'weekly';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  transactionHash: string;
}

export function isSubscriptionActive(subscription: Subscription): boolean {
  const now = new Date();
  return subscription.isActive && now <= subscription.endDate;
}

export function createSubscription(
  userId: string,
  type: 'daily' | 'weekly',
  transactionHash: string
): Subscription {
  const startDate = new Date();
  const endDate = new Date();
  
  if (type === 'daily') {
    endDate.setDate(startDate.getDate() + 1);
  } else {
    endDate.setDate(startDate.getDate() + 7);
  }

  return {
    userId,
    type,
    startDate,
    endDate,
    isActive: true,
    transactionHash,
  };
}

// Free tier management
export interface FreeTierUsage {
  userId: string;
  recipesGenerated: number;
  lastResetDate: Date;
  dailyLimit: number;
}

export const FREE_TIER_DAILY_LIMIT = 3;

export function canGenerateRecipe(usage: FreeTierUsage, subscription?: Subscription): boolean {
  // Check if user has active subscription
  if (subscription && isSubscriptionActive(subscription)) {
    return true;
  }

  // Check free tier limits
  const today = new Date();
  const lastReset = new Date(usage.lastResetDate);
  
  // Reset daily count if it's a new day
  if (today.toDateString() !== lastReset.toDateString()) {
    return true; // Will be reset when generating
  }

  return usage.recipesGenerated < usage.dailyLimit;
}

export function updateFreeTierUsage(usage: FreeTierUsage): FreeTierUsage {
  const today = new Date();
  const lastReset = new Date(usage.lastResetDate);
  
  // Reset if it's a new day
  if (today.toDateString() !== lastReset.toDateString()) {
    return {
      ...usage,
      recipesGenerated: 1,
      lastResetDate: today,
    };
  }

  return {
    ...usage,
    recipesGenerated: usage.recipesGenerated + 1,
  };
}
