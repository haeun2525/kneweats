import { Flame, Heart, Leaf, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RestaurantCardProps {
  restaurant: {
    image: string;
    name: string;
    distance: string;
    menus: { allergens: string[] }[];
    cuisineTags: string[];
    isVegan: boolean;
    spiciness: number;
  };
  userProfile: {
    allergies: string[];
  };
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export function RestaurantCard({
  restaurant,
  userProfile,
  onClick,
  isFavorite = false,
  onToggleFavorite
}: RestaurantCardProps) {

  const hasUserAllergens = restaurant.menus.some(menu =>
    menu.allergens.some(allergen => userProfile.allergies.includes(allergen))
  );

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(e);
  };

  return (
    <div
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden text-left cursor-pointer"
    >
      <div className="relative h-40">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />

        {hasUserAllergens ? (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Contains allergens
          </div>
        ) : (
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

            <button
              onClick={handleFavoriteClick}
              className="flex-shrink-0 w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center hover:bg-orange-100 transition-colors"
            >
              <Heart
                className={`size-4 ${
                  isFavorite
                    ? 'fill-orange-500 text-orange-500'
                    : 'text-gray-400 hover:text-orange-500'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {restaurant.cuisineTags.map(tag => (
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
    </div>
  );
}
