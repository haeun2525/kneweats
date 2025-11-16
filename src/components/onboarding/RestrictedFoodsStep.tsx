import { Button } from '../ui/button';

interface RestrictedFoodsStepProps {
  religion: string;
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
}

const restrictedFoodsByReligion: Record<string, string[]> = {
  Judaism: ['Pork', 'Shellfish', 'Non-kosher meat'],
  Islam: ['Pork', 'Alcohol', 'Non-halal meat'],
};

export function RestrictedFoodsStep({ religion, value, onChange, onNext }: RestrictedFoodsStepProps) {
  const foods = restrictedFoodsByReligion[religion] || [];

  const toggleFood = (food: string) => {
    if (value.includes(food)) {
      onChange(value.filter(f => f !== food));
    } else {
      onChange([...value, food]);
    }
  };

  // Pre-select all by default if none selected
  if (value.length === 0 && foods.length > 0) {
    setTimeout(() => onChange(foods), 0);
  }

  return (
    <div>
      <h2 className="text-gray-800 mb-2">Restricted foods</h2>
      <p className="text-gray-500 text-sm mb-6">
        Based on {religion}, these foods are typically restricted. You can adjust them.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {foods.map((food) => (
          <button
            key={food}
            onClick={() => toggleFood(food)}
            className={`px-4 py-2 rounded-full border-2 transition-all ${
              value.includes(food)
                ? 'border-orange-500 bg-orange-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-orange-200'
            }`}
          >
            {food}
          </button>
        ))}
      </div>

      <Button
        onClick={onNext}
        className="w-full rounded-full bg-orange-500 hover:bg-orange-600"
      >
        Next
      </Button>
    </div>
  );
}
