'use client';

import { ChatMessage as ChatMessageType } from '@/lib/types';
import { Bot, User, Info, Clock, Users } from 'lucide-react';
import { RecipeCard } from './RecipeCard';

interface ChatMessageProps {
  message: ChatMessageType;
  onSaveRecipe?: (recipeId: string) => void;
  onGenerateRecipe?: (recipeId: string) => void;
}

export function ChatMessage({ message, onSaveRecipe, onGenerateRecipe }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getIcon = () => {
    switch (message.type) {
      case 'user':
        return <User size={16} />;
      case 'bot':
        return <Bot size={16} />;
      case 'info':
        return <Info size={16} />;
      default:
        return null;
    }
  };

  const getMessageStyle = () => {
    switch (message.type) {
      case 'user':
        return 'chat-message-user';
      case 'bot':
        return 'chat-message-bot';
      case 'info':
        return 'glass-card text-center text-gray-300 text-sm py-2 px-4 mx-auto max-w-xs';
      default:
        return '';
    }
  };

  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : message.type === 'info' ? 'justify-center' : 'justify-start'} mb-4 animate-slide-up`}>
      <div className="max-w-md w-full">
        {message.type !== 'info' && (
          <div className={`flex items-center gap-2 mb-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              {getIcon()}
              <span>{formatTime(message.timestamp)}</span>
            </div>
          </div>
        )}
        
        <div className={getMessageStyle()}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.recipe && (
          <div className="mt-3">
            <RecipeCard 
              recipe={message.recipe} 
              variant="detailed"
              onSave={onSaveRecipe}
              onGenerate={onGenerateRecipe}
            />
          </div>
        )}
      </div>
    </div>
  );
}
