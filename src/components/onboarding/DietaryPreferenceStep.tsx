import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

interface DietaryPreferenceStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const preferences = ['Vegan', 'Vegetarian', 'Flexitarian', 'None'];

export function DietaryPreferenceStep({ value, onChange, onNext }: DietaryPreferenceStepProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div>
      <h2 className="text-gray-800 mb-2">Dietary preference</h2>
      <p className="text-gray-500 text-sm mb-6">How do you prefer to eat?</p>

      <div className="space-y-3 mb-4">
        {preferences.map((pref) => (
          <button
            key={pref}
            onClick={() => onChange(pref)}
            className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
              value === pref
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-orange-200'
            }`}
          >
            {pref}
          </button>
        ))}
      </div>

      {value === 'Vegan' && (
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-2 text-sm text-orange-600 mb-4 hover:text-orange-700"
        >
          {showExplanation ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          What's the difference?
        </button>
      )}

      {showExplanation && value === 'Vegan' && (
        <div className="bg-orange-50 rounded-xl p-4 mb-4 text-sm text-gray-700 space-y-2">
          <div>
            <span className="text-orange-700">🌱 Vegan:</span> No animal products at all (no meat, dairy, eggs, honey)
          </div>
          <div>
            <span className="text-orange-700">🥛 Vegetarian:</span> No meat, but dairy and eggs are okay
          </div>
          <div>
            <span className="text-orange-700">🍽️ Flexitarian:</span> Mostly plant-based, but occasionally eats meat
          </div>
        </div>
      )}

      <Button
        onClick={onNext}
        disabled={!value}
        className="w-full rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200"
      >
        Next
      </Button>
    </div>
  );
}
