import { useState } from 'react';
import { ChevronLeft, MapPin, Flame, MessageCircle, X, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Restaurant, UserProfile, Menu } from '../App';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  userProfile: UserProfile;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function RestaurantDetail({ restaurant, userProfile, onBack, isFavorite, onToggleFavorite }: RestaurantDetailProps) {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [phraseIngredient, setPhraseIngredient] = useState<string | null>(null);

  const handleAskInKorean = (menu: Menu, ingredient: string) => {
    setSelectedMenu(menu);
    setPhraseIngredient(ingredient);
  };

  const closePhraseCard = () => {
    setSelectedMenu(null);
    setPhraseIngredient(null);
  };

  const getKoreanIngredient = (ingredient: string): string => {
    const translations: Record<string, string> = {
      'Pork': '돼지고기',
      'Beef': '소고기',
      'Chicken': '닭고기',
      'Fish': '생선',
      'Shellfish': '조개',
      'Shrimp': '새우',
      'Eggs': '계란',
      'Milk': '우유',
      'Cheese': '치즈',
      'Gluten': '글루텐',
      'Wheat': '밀',
      'Soy': '콩',
      'Peanuts': '땅콩',
      'Tree nuts': '견과류',
      'Sesame': '참깨',
      'MSG': 'MSG',
      'Alcohol': '술',
    };
    return translations[ingredient] || ingredient;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <ChevronLeft className="size-5 text-gray-700" />
        </button>
        <button
          onClick={onToggleFavorite}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
            isFavorite 
              ? 'bg-orange-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-orange-50'
          }`}
        >
          <Heart className={`size-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Restaurant Info */}
        <div className="mb-6">
          <h1 className="text-gray-800 mb-2">{restaurant.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="size-4" />
              <span>{restaurant.distance}</span>
            </div>
            {restaurant.spiciness > 0 && (
              <div className="flex items-center gap-1">
                <Flame className="size-4 text-orange-500" />
                <span>Spicy Level {restaurant.spiciness}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {restaurant.cuisineTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Menu List */}
        <div>
          <h2 className="text-gray-800 mb-4">Menu</h2>
          <div className="space-y-3">
            {restaurant.menus.map((menu) => {
              const hasUserAllergens = menu.allergens.some(allergen =>
                userProfile.allergies.includes(allergen)
              );

              return (
                <div
                  key={menu.id}
                  className="bg-gray-50 rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-gray-800 mb-1">{menu.name}</h3>
                      {menu.spiciness > 0 && (
                        <div className="flex items-center gap-2">
                          <Flame className="size-3 text-orange-500" />
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-4 h-1 rounded-full ${
                                  i < menu.spiciness ? 'bg-orange-500' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {hasUserAllergens ? (
                      <div className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full whitespace-nowrap">
                        Contains your allergen
                      </div>
                    ) : (
                      <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full whitespace-nowrap">
                        Safe for you
                      </div>
                    )}
                  </div>

                  {menu.allergens.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">Contains:</p>
                      <div className="flex flex-wrap gap-1">
                        {menu.allergens.map((allergen) => (
                          <span
                            key={allergen}
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              userProfile.allergies.includes(allergen)
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ask in Korean buttons */}
                  <div className="flex flex-wrap gap-2">
                    {menu.allergens.map((allergen) => (
                      <Button
                        key={allergen}
                        onClick={() => handleAskInKorean(menu, allergen)}
                        size="sm"
                        variant="outline"
                        className="rounded-full text-xs border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <MessageCircle className="size-3 mr-1" />
                        Ask about {allergen}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Korean Phrase Card Modal */}
      {selectedMenu && phraseIngredient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-gray-800">Ask in Korean</h3>
              <button
                onClick={closePhraseCard}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="bg-orange-50 rounded-2xl p-4 mb-4">
              <p className="text-gray-800 text-center mb-3">
                이 메뉴에 <span className="text-orange-600">{getKoreanIngredient(phraseIngredient)}</span> 들어가요?
              </p>
              <p className="text-sm text-gray-500 text-center">
                i menu-e <span className="text-orange-600">{getKoreanIngredient(phraseIngredient)}</span> deul-eo-ga-yo?
              </p>
            </div>

            <p className="text-sm text-gray-600 text-center mb-4">
              "Does this menu contain {phraseIngredient}?"
            </p>

            <Button
              onClick={closePhraseCard}
              className="w-full rounded-full bg-orange-500 hover:bg-orange-600"
            >
              Got it!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}