import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface NationalityStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const commonNationalities = [
  'USA', 'China', 'Japan', 'Vietnam', 'Thailand',
  'Indonesia', 'India', 'France', 'Germany', 'UK',
  'Canada', 'Australia', 'Philippines', 'Malaysia', 'Singapore'
];

export function NationalityStep({ value, onChange, onNext }: NationalityStepProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleSelect = (nationality: string) => {
    onChange(nationality);
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setShowCustomInput(false);
    }
  };

  return (
    <div>
      <h2 className="text-gray-800 mb-2">Where are you from?</h2>
      <p className="text-gray-500 text-sm mb-6">Select your nationality</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {commonNationalities.map((nationality) => (
          <button
            key={nationality}
            onClick={() => handleSelect(nationality)}
            className={`px-4 py-2 rounded-full border-2 transition-all ${
              value === nationality
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-orange-200'
            }`}
          >
            {nationality}
          </button>
        ))}
        
        {!showCustomInput && !commonNationalities.includes(value) && value && (
          <button
            onClick={() => {
              setCustomValue(value);
              setShowCustomInput(true);
            }}
            className="px-4 py-2 rounded-full border-2 border-orange-500 bg-orange-50 text-orange-700"
          >
            {value}
          </button>
        )}
        
        <button
          onClick={() => setShowCustomInput(true)}
          className="px-4 py-2 rounded-full border-2 border-dashed border-gray-300 bg-white text-gray-500 hover:border-orange-300 hover:text-orange-600"
        >
          + Other
        </button>
      </div>

      {showCustomInput && (
        <div className="mb-6 flex gap-2">
          <Input
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="Enter your nationality"
            className="rounded-full"
            autoFocus
          />
          <Button
            onClick={handleCustomSubmit}
            className="rounded-full bg-orange-500 hover:bg-orange-600"
          >
            Add
          </Button>
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
