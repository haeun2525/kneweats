import { Button } from '../ui/button';

interface ReligionStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const religions = ['Judaism', 'Islam', 'No religion or others'];

export function ReligionStep({ value, onChange, onNext }: ReligionStepProps) {
  return (
    <div>
      <h2 className="text-gray-800 mb-2">Your religion</h2>
      <p className="text-gray-500 text-sm mb-6">This helps us filter foods that match your beliefs</p>

      <div className="space-y-3 mb-6">
        {religions.map((religion) => (
          <button
            key={religion}
            onClick={() => onChange(religion)}
            className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
              value === religion
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-orange-200'
            }`}
          >
            {religion}
          </button>
        ))}
      </div>

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
