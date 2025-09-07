'use client';

import { useState } from 'react';
import { User } from '@/lib/types';
import { DIETARY_PREFERENCES, COMMON_ALLERGIES } from '@/lib/constants';
import { Settings2, X, Check } from 'lucide-react';

interface UserSettingsProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function UserSettings({ user, onUpdateUser, isOpen, onClose }: UserSettingsProps) {
  const [localUser, setLocalUser] = useState<User>(user);

  const handleSave = () => {
    onUpdateUser(localUser);
    onClose();
  };

  const toggleDietaryPreference = (preference: string) => {
    const current = localUser.dietary_preferences;
    const updated = current.includes(preference)
      ? current.filter(p => p !== preference)
      : [...current, preference];
    
    setLocalUser({ ...localUser, dietary_preferences: updated });
  };

  const toggleAllergy = (allergy: string) => {
    const current = localUser.allergies;
    const updated = current.includes(allergy)
      ? current.filter(a => a !== allergy)
      : [...current, allergy];
    
    setLocalUser({ ...localUser, allergies: updated });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="glass-card max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-white border-opacity-20">
          <div className="flex items-center gap-2">
            <Settings2 size={20} className="text-accent" />
            <h2 className="text-xl font-bold text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Calorie Goal */}
          <div>
            <label className="block text-white font-medium mb-2">
              Daily Calorie Goal (optional)
            </label>
            <input
              type="number"
              value={localUser.calorie_goal || ''}
              onChange={(e) => setLocalUser({
                ...localUser,
                calorie_goal: e.target.value ? parseInt(e.target.value) : undefined
              })}
              placeholder="e.g., 2000"
              className="input-field w-full"
            />
          </div>

          {/* Dietary Preferences */}
          <div>
            <label className="block text-white font-medium mb-3">
              Dietary Preferences
            </label>
            <div className="space-y-2">
              {DIETARY_PREFERENCES.map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => toggleDietaryPreference(pref.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                    localUser.dietary_preferences.includes(pref.id)
                      ? 'bg-accent bg-opacity-20 border-accent text-white'
                      : 'glass-card border-white border-opacity-20 text-gray-300 hover:bg-opacity-15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{pref.name}</p>
                      <p className="text-xs opacity-75">{pref.description}</p>
                    </div>
                    {localUser.dietary_preferences.includes(pref.id) && (
                      <Check size={16} className="text-accent" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-white font-medium mb-3">
              Allergies & Restrictions
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_ALLERGIES.map((allergy) => (
                <button
                  key={allergy}
                  onClick={() => toggleAllergy(allergy)}
                  className={`p-2 rounded-lg text-sm transition-all duration-200 ${
                    localUser.allergies.includes(allergy)
                      ? 'bg-red-500 bg-opacity-20 border border-red-500 text-red-300'
                      : 'glass-card text-gray-300 hover:bg-opacity-15'
                  }`}
                >
                  {allergy}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white border-opacity-20">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex-1"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
