import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { RestaurantCard } from './RestaurantCard';
import type { UserProfile, Restaurant } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  userProfile: UserProfile;
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

// Mock restaurant data
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Kimchi Garden',
    image: 'https://images.unsplash.com/photo-1629642621587-9947ce328799?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjByZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3NjMyNzU1MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    cuisineTags: ['Korean', 'Spicy'],
    hasAllergens: false,
    isVegan: false,
    isHalal: true,
    spiciness: 3,
    distance: '0.3 km',
    menus: [
      { id: '1', name: 'Bibimbap', allergens: ['Eggs', 'Sesame'], spiciness: 2, isSafe: true },
      { id: '2', name: 'Kimchi Stew', allergens: ['Fish'], spiciness: 4, isSafe: true },
    ],
  },
  {
    id: '2',
    name: 'Sushi Box',
    image: 'https://images.unsplash.com/photo-1725122194872-ace87e5a1a8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjMyNTA1NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    cuisineTags: ['Japanese', 'Seafood'],
    hasAllergens: true,
    isVegan: false,
    isHalal: false,
    spiciness: 0,
    distance: '0.5 km',
    menus: [
      { id: '1', name: 'Salmon Sushi', allergens: ['Fish'], spiciness: 0, isSafe: false },
      { id: '2', name: 'California Roll', allergens: ['Fish', 'Shellfish'], spiciness: 0, isSafe: false },
    ],
  },
  {
    id: '3',
    name: 'Green Bowl',
    image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2MzIyMDk0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    cuisineTags: ['Healthy', 'Vegan'],
    hasAllergens: false,
    isVegan: true,
    isHalal: true,
    spiciness: 1,
    distance: '0.7 km',
    menus: [
      { id: '1', name: 'Buddha Bowl', allergens: [], spiciness: 0, isSafe: true },
      { id: '2', name: 'Quinoa Salad', allergens: [], spiciness: 1, isSafe: true },
    ],
  },
  {
    id: '4',
    name: 'Burger Station',
    image: 'https://images.unsplash.com/photo-1575270043462-e5cac6d0d745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZXN0ZXJuJTIwYnVyZ2VyJTIwY2FmZXxlbnwxfHx8fDE3NjMyOTU3MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    cuisineTags: ['Western', 'Fast food'],
    hasAllergens: true,
    isVegan: false,
    isHalal: false,
    spiciness: 1,
    distance: '1.2 km',
    menus: [
      { id: '1', name: 'Cheese Burger', allergens: ['Gluten', 'Milk', 'Beef'], spiciness: 1, isSafe: false },
      { id: '2', name: 'Chicken Burger', allergens: ['Gluten', 'Eggs'], spiciness: 2, isSafe: true },
    ],
  },
  {
    id: '5',
    name: 'Seoul Kitchen',
    image: 'https://images.unsplash.com/photo-1741295017668-c8132acd6fc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiaWJpbWJhcCUyMGJvd2x8ZW58MXx8fHwxNzYzMTkxNjMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    cuisineTags: ['Korean', 'Traditional'],
    hasAllergens: false,
    isVegan: false,
    isHalal: true,
    spiciness: 2,
    distance: '0.4 km',
    menus: [
      { id: '1', name: 'Bulgogi', allergens: ['Soy'], spiciness: 1, isSafe: true },
      { id: '2', name: 'Japchae', allergens: ['Soy'], spiciness: 0, isSafe: true },
    ],
  },
];

const filterOptions = [
  { id: 'vegan', label: 'Vegan', color: 'green' },
  { id: 'halal', label: 'Halal-friendly', color: 'blue' },
  { id: 'spicy', label: 'Spicy', color: 'red' },
  { id: 'safe', label: 'Allergen-safe', color: 'orange' },
];

export function HomePage({ userProfile, onRestaurantSelect }: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      setActiveFilters(activeFilters.filter(f => f !== filterId));
    } else {
      setActiveFilters([...activeFilters, filterId]);
    }
  };

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    // Search filter
    if (searchTerm && !restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Active filters
    if (activeFilters.includes('vegan') && !restaurant.isVegan) return false;
    if (activeFilters.includes('halal') && !restaurant.isHalal) return false;
    if (activeFilters.includes('spicy') && restaurant.spiciness < 2) return false;
    if (activeFilters.includes('safe') && restaurant.hasAllergens) return false;

    return true;
  });

  return (
    <div className="min-h-screen pb-4">
      {/* University Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="size-4" />
            <p className="text-sm opacity-90">You are near</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-xl">🎓</span>
            </div>
            <h1 className="text-white">Sookmyung Women's University</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Where to eat?"
              className="pl-10 rounded-full border-gray-200"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm border-2 transition-all ${
                activeFilters.includes(filter.id)
                  ? 'border-orange-500 bg-orange-500 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-orange-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Restaurant List */}
        <div className="space-y-4">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              userProfile={userProfile}
              onClick={() => onRestaurantSelect(restaurant)}
            />
          ))}
          
          {filteredRestaurants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-2">No restaurants found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
