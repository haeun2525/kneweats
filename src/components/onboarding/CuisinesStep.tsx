import { Button } from '../ui/button';

interface CuisinesStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  onComplete: () => void;
}

const cuisines = [
  { id: 'western', emoji: '🍔', label: 'Western' },
  { id: 'japanese', emoji: '🍣', label: 'Japanese' },
  { id: 'korean', emoji: '🍜', label: 'Korean' },
  { id: 'healthy', emoji: '🥗', label: 'Healthy' },
  { id: 'fastfood', emoji: '🍕', label: 'Fast food' },
];

export function CuisinesStep({ value, onChange, onComplete }: CuisinesStepProps) {
  const toggleCuisine = (cuisineId: string) => {
    if (value.includes(cuisineId)) {
      onChange(value.filter(c => c !== cuisineId));
    } else {
      onChange([...value, cuisineId]);
    }
  };

  return (
    <div>
      <h2 className="text-gray-800 mb-2">Preferred cuisines</h2>
      <p className="text-gray-500 text-sm mb-6">Select all cuisines you enjoy</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine.id}
            onClick={() => toggleCuisine(cuisine.id)}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
              value.includes(cuisine.id)
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-white hover:border-orange-200'
            }`}
          >
            <span className="text-3xl">{cuisine.emoji}</span>
            <span className={`text-sm ${
              value.includes(cuisine.id) ? 'text-orange-700' : 'text-gray-700'
            }`}>
              {cuisine.label}
            </span>
          </button>
        ))}
      </div>

      <Button
        onClick={onComplete}
        disabled={value.length === 0}
        className="w-full rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200"
      >
        Start Exploring Restaurants
      </Button>
    </div>
  );
}
