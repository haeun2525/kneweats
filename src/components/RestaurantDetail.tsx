import { useState } from 'react';
import { ChevronLeft, MapPin, Flame, MessageCircle, X, Heart, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
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
  const [menuSearchTerm, setMenuSearchTerm] = useState<string>('');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [tempExcludedAllergens, setTempExcludedAllergens] = useState<string[]>([]);

  // compute summary tag counts (same logic as RestaurantCard)
  const totalMenus = restaurant.menus.length;
  const unsafeCount = restaurant.menus.filter(menu =>
    menu.allergens.some(a =>
      userProfile.allergies.includes(a) ||
      (userProfile.restrictedFoods && userProfile.restrictedFoods.includes(a))
    )
  ).length;
  const safeCount = Math.max(0, totalMenus - unsafeCount);
  const showSummaryTag = totalMenus > 0;
  const isMostlyUnsafe = unsafeCount > totalMenus / 2;

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
        {showSummaryTag && (
          <div
            className={`absolute top-4 right-4 text-white text-sm px-3 py-1.5 rounded-full z-10 ${
              isMostlyUnsafe ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {safeCount}/{totalMenus} are safe for you
          </div>
        )}
        {/* Fixed back button so it's always visible while scrolling */}
        <button
          onClick={onBack}
          className="fixed top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-50 safe-area-inset-left"
          aria-label="Back"
        >
          <ChevronLeft className="size-5 text-gray-700" />
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Restaurant Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-800">{restaurant.name}</h1>
            <button
              onClick={onToggleFavorite}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ml-2 ${
                isFavorite 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              <Heart className={`size-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
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

        {/* Menu Search (below restaurant info, above the menu list) */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              value={menuSearchTerm}
              onChange={(e) => setMenuSearchTerm(e.target.value)}
              placeholder="Search menu items or allergens"
              className="pl-10 rounded-full border-gray-200 pr-12"
            />
            <button
              onClick={() => {
                setTempExcludedAllergens(excludedAllergens);
                setShowFilterSheet(true);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm"
              aria-label="Filter menus"
            >
              <Filter className="size-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Menu List */}
        <div>
          <h2 className="text-gray-800 mb-4">Menu</h2>
          <div className="space-y-3">
            {restaurant.menus
              .filter((menu) => {
                const term = menuSearchTerm.trim().toLowerCase();
                if (term) {
                  const matchName = menu.name.toLowerCase().includes(term);
                  const matchAllergen = menu.allergens.some(a => a.toLowerCase().includes(term));
                  if (!(matchName || matchAllergen)) return false;
                }
                // Exclude menus that contain any allergen selected to be excluded
                if (excludedAllergens.length > 0) {
                  if (menu.allergens.some(a => excludedAllergens.includes(a))) {
                    return false;
                  }
                }
                // Exclude menus that contain restricted foods based on dietary preference
                if (userProfile.restrictedFoods && userProfile.restrictedFoods.length > 0) {
                  if (menu.allergens.some(a => userProfile.restrictedFoods.includes(a))) {
                    return false;
                  }
                }
                return true;
              })
              .map((menu) => {
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
            {restaurant.menus.filter(m => {
              const term = menuSearchTerm.trim().toLowerCase();
              const matchesTerm = term && (m.name.toLowerCase().includes(term) || m.allergens.some(a => a.toLowerCase().includes(term)));
              const excluded = excludedAllergens.length > 0 && m.allergens.some(a => excludedAllergens.includes(a));
              return !(matchesTerm) && !excluded;
            }).length === restaurant.menus.length && menuSearchTerm.trim() !== '' && (
               <div className="text-center py-8 text-gray-500">
                 No menu items match your search.
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Filter Bottom Sheet */}
      {showFilterSheet && (
        <div className="fixed inset-0 z-[999999]">
          {/* darker overlay (matches Feedback modal intensity) */}
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setShowFilterSheet(false)}
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl z-[1000000]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-800">Exclude Ingredients</h3>
                <button
                  onClick={() => setShowFilterSheet(false)}
                  className="text-gray-400"
                  aria-label="Close filters"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Chips — unique allergens present only in this restaurant's menus */}
              <div className="flex flex-wrap gap-2 mb-4 max-h-60 overflow-y-auto">
                {Array.from(
                  new Set(
                    restaurant.menus.flatMap((m) => (Array.isArray(m.allergens) ? m.allergens : []))
                  )
                )
                  .filter(Boolean)
                  .map((allergen) => {
                    const active = tempExcludedAllergens.includes(allergen);
                    return (
                      <button
                        key={allergen}
                        onClick={() =>
                          setTempExcludedAllergens((prev) =>
                            prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-sm transition-all border-2 ${
                          active ? 'bg-red-100 border-red-300 text-red-700' : 'bg-gray-100 border-gray-200 text-gray-700'
                        }`}
                      >
                        {allergen}
                      </button>
                    );
                  })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setTempExcludedAllergens([])}
                  className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-gray-700"
                >
                  Deselect all
                </button>
                <button
                  onClick={() => setShowFilterSheet(false)}
                  className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setExcludedAllergens(tempExcludedAllergens);
                    setShowFilterSheet(false);
                  }}
                  className="px-4 py-2 rounded-full bg-orange-500 text-white"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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