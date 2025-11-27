import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { RestaurantCard } from './RestaurantCard';
import type { UserProfile, Restaurant } from '../App';
import { getRestaurantsWithMenus } from "../lib/supabase/restaurants";

interface HomePageProps {
  userProfile: UserProfile;
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

const filterOptions = [
  { id: 'vegan', label: 'Vegan', color: 'green' },
  { id: 'halal', label: 'Halal-friendly', color: 'blue' },
  { id: 'spicy', label: 'Spicy', color: 'red' },
  { id: 'safe', label: 'Allergen-safe', color: 'orange' },
];

export function HomePage({ userProfile, onRestaurantSelect }: HomePageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  async function load() {
    try {
      const data = await getRestaurantsWithMenus();
      console.log("supabase raw data >>", data);

      const mapped: Restaurant[] = data.map((r: any) => ({
        id: String(r.id),
        name: r.name,
        image: r.image ?? "",

        // Supabase 컬럼: cuisine_tages (text, "Korean,Cafe" 이런 형식이라고 가정)
        cuisineTags: r.cuisine_tags
          ? String(r.cuisine_tags)
              .split(",")
              .map((t: string) => t.trim())
          : [],

        // 일단 기본값들 (나중에 menus 기반으로 계산 가능)
        hasAllergens: false,
        isVegan: false,
        isHalal: false,
        spiciness: 0,
        distance: r.distance ?? "",

        // r.menus 가 없을 수도 있으니까 방어코드
        menus: (r.menus ?? []).map((m: any) => ({
          id: String(m.id),
          name: m.name,
          allergens: m.allergens
            ? String(m.allergens)
                .split(",")
                .map((a: string) => a.trim())
            : [],
          spiciness: m.spiciness ?? 0,
          isSafe: true, // 나중에 userProfile 기준으로 계산 가능
        })),
      }));

      console.log("mapped restaurants >>", mapped);
      setRestaurants(mapped);
    } catch (err) {
      console.error("Supabase fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  load();
}, []);




  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      setActiveFilters(activeFilters.filter(f => f !== filterId));
    } else {
      setActiveFilters([...activeFilters, filterId]);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (searchTerm && !restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;

    if (activeFilters.includes('vegan') && !restaurant.isVegan) return false;
    if (activeFilters.includes('halal') && !restaurant.isHalal) return false;
    if (activeFilters.includes('spicy') && restaurant.spiciness < 2) return false;
    if (activeFilters.includes('safe') && restaurant.hasAllergens) return false;

    return true;
  });

  return (
    <div className="min-h-screen pb-4">
      {/* Header */}
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
        {/* Search */}
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

        {/* Filters */}
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

        {/* List */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading restaurants…</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
