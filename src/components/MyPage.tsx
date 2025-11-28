import { useState } from 'react';
import { Edit2, ChevronRight, MessageCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import type { UserProfile } from '../App';
import { NationalityStep } from './onboarding/NationalityStep';
import { ReligionStep } from './onboarding/ReligionStep';
import { RestrictedFoodsStep } from './onboarding/RestrictedFoodsStep';
import { DietaryPreferenceStep } from './onboarding/DietaryPreferenceStep';
import { AllergiesStep } from './onboarding/AllergiesStep';
import { CuisinesStep } from './onboarding/CuisinesStep';

interface MyPageProps {
  userProfile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export function MyPage({ userProfile, onProfileUpdate }: MyPageProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showKoreanTool, setShowKoreanTool] = useState(false);
  const [selectedAllergen, setSelectedAllergen] = useState<string | null>(null);

  // Editor modal state (which category is being edited)
  const [editingCategory, setEditingCategory] = useState<
    null | 'nationality' | 'religion' | 'restrictedFoods' | 'dietaryPreference' | 'allergies' | 'preferredCuisines'
  >(null);

  // Temporary editable values (initialized when opening editor)
  const [tempNationality, setTempNationality] = useState(userProfile.nationality);
  const [tempReligion, setTempReligion] = useState(userProfile.religion);
  const [tempRestrictedFoods, setTempRestrictedFoods] = useState<string[]>([...userProfile.restrictedFoods]);
  const [tempDietaryPreference, setTempDietaryPreference] = useState(userProfile.dietaryPreference);
  const [tempAllergies, setTempAllergies] = useState<string[]>([...userProfile.allergies]);
  const [tempPreferredCuisines, setTempPreferredCuisines] = useState<string[]>([...userProfile.preferredCuisines]);

  const getKoreanIngredient = (ingredient: string): string => {
    const translations: Record<string, string> = {
      'Pork': '돼지고기',
      'Beef': '소고기',
      'Chicken': '닭고기',
      'Lamb': '양고기',
      'Fish': '생선',
      'Shellfish': '조개',
      'Shrimp': '새우',
      'Crab': '게',
      'Squid': '오징어',
      'Eggs': '계란',
      'Milk': '우유',
      'Cheese': '치즈',
      'Butter': '버터',
      'Yogurt': '요구르트',
      'Gluten': '글루텐',
      'Wheat': '밀',
      'Rice': '쌀',
      'Barley': '보리',
      'Oats': '귀리',
      'Soy': '콩',
      'Peanuts': '땅콩',
      'Tree nuts': '견과류',
      'Almonds': '아몬드',
      'Walnuts': '호두',
      'Cashews': '캐슈넛',
      'Sesame': '참깨',
      'MSG': 'MSG',
      'Sulfites': '아황산염',
      'Mustard': '겨자',
      'Tomatoes': '토마토',
      'Mushrooms': '버섯',
      'Peaches': '복숭아',
      'Alcohol': '술',
    };
    return translations[ingredient] || ingredient;
  };

  const allAllergens = [
    'Wheat', 'Gluten', 'Rice', 'Barley', 'Oats',
    'Milk', 'Eggs', 'Cheese', 'Butter', 'Yogurt',
    'Beef', 'Pork', 'Chicken', 'Lamb',
    'Fish', 'Shellfish', 'Shrimp', 'Crab', 'Squid',
    'Peanuts', 'Tree nuts', 'Almonds', 'Walnuts', 'Cashews',
    'Soy', 'Tomatoes', 'Mushrooms', 'Peaches',
    'Sesame', 'MSG', 'Sulfites', 'Mustard',
  ];

  const cuisineEmojis: Record<string, string> = {
    'western': '🍔',
    'japanese': '🍣',
    'korean': '🍜',
    'healthy': '🥗',
    'fastfood': '🍕',
  };

  const cuisineLabels: Record<string, string> = {
    'western': 'Western',
    'japanese': 'Japanese',
    'korean': 'Korean',
    'healthy': 'Healthy',
    'fastfood': 'Fast food',
  };

  const openEditor = (category: typeof editingCategory) => {
    // initialize temps from current profile so modal shows current values
    setTempNationality(userProfile.nationality);
    setTempReligion(userProfile.religion);
    setTempRestrictedFoods([...userProfile.restrictedFoods]);
    setTempDietaryPreference(userProfile.dietaryPreference);
    setTempAllergies([...userProfile.allergies]);
    setTempPreferredCuisines([...userProfile.preferredCuisines]);
    setEditingCategory(category);
  };

  const closeEditor = () => setEditingCategory(null);

  const saveEditor = () => {
    const updated: UserProfile = {
      ...userProfile,
      nationality: tempNationality,
      religion: tempReligion,
      restrictedFoods: tempRestrictedFoods,
      dietaryPreference: tempDietaryPreference,
      allergies: tempAllergies,
      preferredCuisines: tempPreferredCuisines,
    };
    onProfileUpdate(updated);
    setEditingCategory(null);
  };

  // Move the editor modal forward through the onboarding-like steps.
  const modalNext = () => {
    if (!editingCategory) return;
    switch (editingCategory) {
      case 'nationality':
        setEditingCategory('religion');
        break;
      case 'religion':
        setEditingCategory('restrictedFoods');
        break;
      case 'restrictedFoods':
        setEditingCategory('dietaryPreference');
        break;
      case 'dietaryPreference':
        setEditingCategory('allergies');
        break;
      case 'allergies':
        setEditingCategory('preferredCuisines');
        break;
      case 'preferredCuisines':
        // finished the mini-flow — save and close
        saveEditor();
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
        <div className="max-w-md mx-auto">
          <h1 className="text-white mb-2">My Profile</h1>
          <p className="text-sm opacity-90">Manage your preferences</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Nationality */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700">Nationality</h3>
            <button
              onClick={() => openEditor('nationality')}
              className="text-orange-500 hover:text-orange-600"
              aria-label="Edit nationality"
            >
              <Edit2 className="size-4" />
            </button>
          </div>
          <p className="text-gray-800">{userProfile.nationality}</p>
        </div>

        {/* Religion */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700">Religion</h3>
            <button
              onClick={() => openEditor('religion')}
              className="text-orange-500 hover:text-orange-600"
              aria-label="Edit religion"
            >
              <Edit2 className="size-4" />
            </button>
          </div>
          <p className="text-gray-800">{userProfile.religion}</p>
        </div>

        {/* Restricted Foods */}
        {userProfile.restrictedFoods && userProfile.restrictedFoods.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-700">Restricted Foods</h3>
              <button
                onClick={() => openEditor('restrictedFoods')}
                className="text-orange-500 hover:text-orange-600"
                aria-label="Edit restricted foods"
              >
                <Edit2 className="size-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {userProfile.restrictedFoods.map((food) => (
                <span
                  key={food}
                  className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full"
                >
                  {food}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dietary Preference */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700">Dietary Preference</h3>
            <button
              onClick={() => openEditor('dietaryPreference')}
              className="text-orange-500 hover:text-orange-600"
              aria-label="Edit dietary preference"
            >
              <Edit2 className="size-4" />
            </button>
          </div>
          <p className="text-gray-800">{userProfile.dietaryPreference}</p>
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700">Allergies & Restrictions</h3>
            <button
              onClick={() => openEditor('allergies')}
              className="text-orange-500 hover:text-orange-600"
              aria-label="Edit allergies"
            >
              <Edit2 className="size-4" />
            </button>
          </div>
          {userProfile.allergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userProfile.allergies.map((allergen) => (
                <span
                  key={allergen}
                  className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                >
                  {allergen}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No allergies added</p>
          )}
        </div>

        {/* Preferred Cuisines */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-700">Preferred Cuisines</h3>
            <button
              onClick={() => openEditor('preferredCuisines')}
              className="text-orange-500 hover:text-orange-600"
              aria-label="Edit preferred cuisines"
            >
              <Edit2 className="size-4" />
            </button>
          </div>
          {userProfile.preferredCuisines.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userProfile.preferredCuisines.map((cuisine) => (
                <span
                  key={cuisine}
                  className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full flex items-center gap-1"
                >
                  <span>{cuisineEmojis[cuisine]}</span>
                  <span>{cuisineLabels[cuisine]}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No preferred cuisines</p>
          )}
        </div>

        {/* Korean Question Card Tool */}
        <button
          onClick={() => setShowKoreanTool(true)}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="size-5" />
            </div>
            <div className="text-left">
              <h3 className="text-white">Korean Question Tool</h3>
              <p className="text-sm text-white/80">Generate phrases for any allergen</p>
            </div>
          </div>
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Korean Question Tool Modal */}
      {showKoreanTool && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
          <div className="bg-white rounded-t-3xl md:rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-gray-800 mb-1">Korean Question Tool</h2>
                <p className="text-sm text-gray-500">
                  Select an allergen to see the Korean phrase
                </p>
              </div>
              <button
                onClick={() => {
                  setShowKoreanTool(false);
                  setSelectedAllergen(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-2 mb-6">
              {allAllergens.map((allergen) => (
                <button
                  key={allergen}
                  onClick={() => setSelectedAllergen(allergen)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedAllergen === allergen
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {allergen}
                </button>
              ))}
            </div>

            {selectedAllergen && (
              <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-200">
                <p className="text-sm text-gray-500 mb-2">Korean phrase:</p>
                <p className="text-gray-800 text-center mb-3">
                  이 메뉴에 <span className="text-orange-600">{getKoreanIngredient(selectedAllergen)}</span> 들어가요?
                </p>
                <p className="text-sm text-gray-500 text-center mb-3">
                  i menu-e <span className="text-orange-600">{getKoreanIngredient(selectedAllergen)}</span> deul-eo-ga-yo?
                </p>
                <p className="text-sm text-gray-600 text-center">
                  "Does this menu contain {selectedAllergen}?"
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editor Modal (re-uses onboarding step components for each category) */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
          <div className="bg-white rounded-t-3xl md:rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-gray-800 mb-1">
                  {editingCategory === 'nationality' && 'Edit nationality'}
                  {editingCategory === 'religion' && 'Edit religion'}
                  {editingCategory === 'restrictedFoods' && 'Edit restricted foods'}
                  {editingCategory === 'dietaryPreference' && 'Edit dietary preference'}
                  {editingCategory === 'allergies' && 'Edit allergies'}
                  {editingCategory === 'preferredCuisines' && 'Edit preferred cuisines'}
                </h2>
                <p className="text-sm text-gray-500">Update and save to apply to your profile</p>
              </div>
              <button
                onClick={closeEditor}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close editor"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Dynamic editor body */}
            <div className="mb-4">
              {editingCategory === 'nationality' && (
                <NationalityStep
                  value={tempNationality}
                  onChange={(v) => setTempNationality(v)}
                  onNext={modalNext}
                />
              )}

              {editingCategory === 'religion' && (
                <ReligionStep
                  value={tempReligion}
                  onChange={(v) => {
                    setTempReligion(v);
                    // update restricted foods when religion changes
                    const derived = (v === 'Judaism') ? ['Pork','Shellfish','Non-kosher meat'] : (v === 'Islam') ? ['Pork','Alcohol','Non-halal meat'] : [];
                    setTempRestrictedFoods(derived);
                    setTempAllergies(derived);
                  }}
                  onNext={modalNext}
                />
              )}

              {editingCategory === 'restrictedFoods' && (
                <RestrictedFoodsStep
                  religion={tempReligion}
                  value={tempRestrictedFoods}
                  onChange={(v) => setTempRestrictedFoods(v)}
                  onNext={modalNext}
                />
              )}

              {editingCategory === 'dietaryPreference' && (
                <DietaryPreferenceStep
                  value={tempDietaryPreference}
                  onChange={(v) => setTempDietaryPreference(v)}
                  onRestrictedFoodsChange={(v) => setTempRestrictedFoods(v)}
                  onAllergiesChange={(v) => setTempAllergies(v)}
                  onNext={modalNext}
                />
              )}

              {editingCategory === 'allergies' && (
                <AllergiesStep
                  value={tempAllergies}
                  onChange={(v) => setTempAllergies(v)}
                  onNext={modalNext}
                />
              )}

              {editingCategory === 'preferredCuisines' && (
                <CuisinesStep
                  value={tempPreferredCuisines}
                  onChange={(v) => setTempPreferredCuisines(v)}
                  onComplete={modalNext}
                />
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={closeEditor}
                className="flex-1 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={saveEditor}
                className="flex-1 px-4 py-2 rounded-full bg-orange-500 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
