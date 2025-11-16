import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AllergiesStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
}

const allergenGroups = {
  'Grains': ['Wheat', 'Gluten', 'Rice', 'Barley', 'Oats'],
  'Dairy & Eggs': ['Milk', 'Eggs', 'Cheese', 'Butter', 'Yogurt'],
  'Meat': ['Beef', 'Pork', 'Chicken', 'Lamb'],
  'Seafood': ['Fish', 'Shellfish', 'Shrimp', 'Crab', 'Squid'],
  'Nuts': ['Peanuts', 'Tree nuts', 'Almonds', 'Walnuts', 'Cashews'],
  'Fruits & Veg': ['Soy', 'Tomatoes', 'Mushrooms', 'Peaches'],
  'Others': ['Sesame', 'MSG', 'Sulfites', 'Mustard'],
};

export function AllergiesStep({ value, onChange, onNext }: AllergiesStepProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const toggleAllergen = (allergen: string) => {
    if (value.includes(allergen)) {
      onChange(value.filter(a => a !== allergen));
    } else {
      onChange([...value, allergen]);
    }
  };

  const filteredGroups = Object.entries(allergenGroups).reduce((acc, [group, allergens]) => {
    const filtered = allergens.filter(a => 
      a.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[group] = filtered;
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div>
      <h2 className="text-gray-800 mb-2">Allergies & Restrictions</h2>
      <p className="text-gray-500 text-sm mb-4">Select all that apply to you</p>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search allergens..."
          className="pl-10 rounded-full"
        />
      </div>

      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
        {Object.entries(filteredGroups).map(([group, allergens]) => (
          <div key={group}>
            <p className="text-xs text-gray-500 mb-2">{group}</p>
            <div className="flex flex-wrap gap-2">
              {allergens.map((allergen) => (
                <button
                  key={allergen}
                  onClick={() => toggleAllergen(allergen)}
                  className={`px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                    value.includes(allergen)
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-orange-200'
                  }`}
                >
                  {allergen}
                </button>
              ))}
            </div>
          </div>
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
