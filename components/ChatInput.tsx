'use client';

import { useState } from 'react';
import { Send, Plus } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onAddIngredient: (ingredient: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({ 
  onSendMessage, 
  onAddIngredient, 
  placeholder = "Type your message...",
  disabled = false 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    if (isAddingIngredient) {
      onAddIngredient(message.trim());
      setIsAddingIngredient(false);
    } else {
      onSendMessage(message.trim());
    }
    
    setMessage('');
  };

  const toggleIngredientMode = () => {
    setIsAddingIngredient(!isAddingIngredient);
    setMessage('');
  };

  return (
    <div className="p-4 border-t border-white border-opacity-20">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleIngredientMode}
          className={`p-2 rounded-lg transition-all duration-200 ${
            isAddingIngredient 
              ? 'bg-accent text-white' 
              : 'glass-card text-white hover:bg-opacity-15'
          }`}
          disabled={disabled}
        >
          <Plus size={20} />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isAddingIngredient ? "Add an ingredient..." : placeholder}
            className="input-field w-full pr-12"
            disabled={disabled}
          />
          
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-accent hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
      
      {isAddingIngredient && (
        <p className="text-sm text-gray-300 mt-2 px-2">
          💡 Add ingredients one by one to build your pantry
        </p>
      )}
    </div>
  );
}
