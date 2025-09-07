'use client';

import { useState } from 'react';
import { X, CreditCard, Clock, Calendar, Sparkles } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { 
  createPaymentRequest, 
  processPayment, 
  formatPaymentAmount,
  PAYMENT_CONFIG 
} from '@/lib/payments';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (transactionHash: string, type: string) => void;
  userAddress?: string;
  recipesRemaining: number;
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  userAddress,
  recipesRemaining 
}: PaymentModalProps) {
  const [selectedOption, setSelectedOption] = useState<'recipe' | 'daily_subscription' | 'weekly_subscription'>('recipe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!userAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const paymentRequest = await createPaymentRequest(selectedOption, userAddress);
      const result = await processPayment(paymentRequest);

      if (result.success && result.transactionHash) {
        onPaymentSuccess(result.transactionHash, selectedOption);
        onClose();
      } else {
        setError(result.error || 'Payment failed');
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentOptions = [
    {
      id: 'recipe' as const,
      title: 'Single Recipe',
      price: formatPaymentAmount(PAYMENT_CONFIG.RECIPE_GENERATION_COST),
      description: 'Generate one personalized recipe',
      icon: <Sparkles size={20} className="text-purple-400" />,
      popular: false,
    },
    {
      id: 'daily_subscription' as const,
      title: 'Daily Pass',
      price: formatPaymentAmount(PAYMENT_CONFIG.SUBSCRIPTION_DAILY_COST),
      description: 'Unlimited recipes for 24 hours',
      icon: <Clock size={20} className="text-blue-400" />,
      popular: true,
    },
    {
      id: 'weekly_subscription' as const,
      title: 'Weekly Pass',
      price: formatPaymentAmount(PAYMENT_CONFIG.SUBSCRIPTION_WEEKLY_COST),
      description: 'Unlimited recipes for 7 days',
      icon: <Calendar size={20} className="text-green-400" />,
      popular: false,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Choose Your Plan</h2>
            <p className="text-sm text-gray-300 mt-1">
              {recipesRemaining > 0 
                ? `${recipesRemaining} free recipes remaining today`
                : 'You\'ve used all free recipes for today'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Payment Options */}
        <div className="space-y-3 mb-6">
          {paymentOptions.map((option) => (
            <div
              key={option.id}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedOption === option.id
                  ? 'border-accent bg-accent bg-opacity-10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => setSelectedOption(option.id)}
            >
              {option.popular && (
                <div className="absolute -top-2 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {option.icon}
                  <div>
                    <h3 className="font-semibold text-white">{option.title}</h3>
                    <p className="text-sm text-gray-300">{option.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-accent">{option.price}</div>
                  <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                    selectedOption === option.id
                      ? 'border-accent bg-accent'
                      : 'border-gray-400'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3 mb-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing || !userAddress}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <LoadingSpinner size="sm" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard size={20} />
              Pay with USDC
            </>
          )}
        </button>

        {/* Wallet Connection Notice */}
        {!userAddress && (
          <p className="text-center text-sm text-gray-400 mt-3">
            Connect your wallet to continue
          </p>
        )}

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg">
          <p className="text-blue-300 text-xs text-center">
            🔒 Secure payments powered by Base blockchain. Your transaction will be processed on-chain.
          </p>
        </div>
      </div>
    </div>
  );
}
