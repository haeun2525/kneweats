import { Heart } from 'lucide-react';
import { RestaurantCard } from './RestaurantCard';
import type { UserProfile, Restaurant } from '../App';

interface FavoritesPageProps {
  userProfile: UserProfile;
  favoriteIds: string[];
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

// Mock restaurant data - same as in HomePage
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

export function FavoritesPage({ userProfile, favoriteIds, onRestaurantSelect }: FavoritesPageProps) {
  const favoriteRestaurants = mockRestaurants.filter(restaurant => 
    favoriteIds.includes(restaurant.id)
  );

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
        <div className="max-w-md mx-auto">
          <h1 className="text-white mb-2">Favorites</h1>
          <p className="text-sm opacity-90">Your saved restaurants</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {favoriteRestaurants.length > 0 ? (
          <div className="space-y-4">
            {favoriteRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                userProfile={userProfile}
                onClick={() => onRestaurantSelect(restaurant)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="size-10 text-orange-400" />
            </div>
            <h2 className="text-gray-800 mb-2">No favorites yet</h2>
            <p className="text-sm text-gray-500 mb-6">
              Start exploring and save your favorite restaurants
            </p>
            <p className="text-xs text-gray-400">
              Tap the heart icon on any restaurant to save it here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
