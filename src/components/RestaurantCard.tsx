import { MapPin, Flame, Leaf, Award } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Restaurant, UserProfile } from '../App';


// Local fallback declarations to satisfy TypeScript JSX typing when @types/react or react/jsx-runtime types are not present.
// These are minimal and safe to keep until you install the proper type packages (@types/react, @types/react-dom)
// or configure the project JSX transform in tsconfig.json.
// NOTE: removed the module augmentation for 'react/jsx-runtime' because that module resolves to an untyped JS file
// in node_modules and cannot be safely augmented; install @types/react and @types/react-dom (or enable skipLibCheck)
// to get proper typings for the JSX runtime instead.

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {}; // ensure this file is treated as a module

interface RestaurantCardProps {
  restaurant: Restaurant;
  userProfile: UserProfile;
  onClick: () => void;
}

export function RestaurantCard({ restaurant, userProfile, onClick }: RestaurantCardProps) {
  const hasUserAllergens = restaurant.menus.some(menu =>
    menu.allergens.some(allergen => userProfile.allergies.includes(allergen))
  );

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden text-left"
    >
      <div className="relative h-40">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        {hasUserAllergens && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Contains allergens
          </div>
        )}
        {!hasUserAllergens && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Safe for you
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-gray-800 mb-1">{restaurant.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="size-3" />
              <span>{restaurant.distance}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {restaurant.isVegan && (
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="size-4 text-green-600" />
              </div>
            )}
            {restaurant.isHalal && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="size-4 text-blue-600" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {restaurant.cuisineTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {restaurant.spiciness > 0 && (
          <div className="flex items-center gap-2">
            <Flame className="size-4 text-orange-500" />
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-1 rounded-full ${
                    i < restaurant.spiciness ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
