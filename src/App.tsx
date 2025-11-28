import { useState, useEffect } from 'react';
import { OnboardingFlow } from './components/OnboardingFlow';
import { HomePage } from './components/HomePage';
import { RestaurantDetail } from './components/RestaurantDetail';
import { MyPage } from './components/MyPage';
import { FeedbackSupport } from './components/FeedbackSupport';
import { FavoritesPage } from './components/FavoritesPage';
import { BottomNav } from './components/BottomNav';

export interface UserProfile {
  nationality: string;
  religion: string;
  restrictedFoods: string[];
  dietaryPreference: string;
  allergies: string[];
  preferredCuisines: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisineTags: string[];
  hasAllergens: boolean;
  isVegan: boolean;
  isHalal: boolean;
  spiciness: number;
  distance: string;
  menus: Menu[];
}

export interface Menu {
  id: string;
  name: string;
  allergens: string[];
  spiciness: number;
  isSafe: boolean;
}

export function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'favorites' | 'support' | 'account'>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse favorites from localStorage, clearing it.', e);
      localStorage.removeItem('favorites');
      return [];
    }
  });

  useEffect(() => {
    // Check if user has completed onboarding (safe-parse, validate)
    const savedProfile = localStorage.getItem('ingrepedia-profile');
    console.log('🔍 Checking for saved profile...', savedProfile ? 'Found' : 'Not found');
    
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        console.log('✅ Parsed profile:', parsed);
        
        // More permissive validation: just check it's an object
        if (parsed && typeof parsed === 'object') {
          console.log('✅ Profile is valid object, setting user profile');
          setUserProfile(parsed as UserProfile);
          setIsOnboarded(true);
        } else {
          throw new Error('Profile is not a valid object');
        }
      } catch (err) {
        console.error('❌ Failed to parse/validate saved profile; clearing.', err);
        localStorage.removeItem('ingrepedia-profile');
        setIsOnboarded(false);
        setUserProfile(null);
      }
    } else {
      console.log('ℹ️ No saved profile, showing onboarding');
      setIsOnboarded(false);
      setUserProfile(null);
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsOnboarded(true);
    localStorage.setItem('ingrepedia-profile', JSON.stringify(profile));
  };

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('ingrepedia-profile', JSON.stringify(profile));
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleBackToHome = () => {
    setSelectedRestaurant(null);
  };

  const toggleFavorite = (restaurantId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(restaurantId)
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (restaurantId: string) => {
    return favorites.includes(restaurantId);
  };

  // Ensure we only render the main app when we have a valid profile.
  console.log('🎯 Render check: isOnboarded =', isOnboarded, 'userProfile =', userProfile ? 'exists' : 'null');
  
  if (!isOnboarded || !userProfile) {
    console.log('📝 Showing OnboardingFlow');
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  console.log('🏠 Showing HomePage');
  return (
    <div className="min-h-screen bg-orange-50/30 pb-20">
      {selectedRestaurant ? (
        <RestaurantDetail 
          restaurant={selectedRestaurant} 
          userProfile={userProfile!}
          onBack={handleBackToHome}
          isFavorite={isFavorite(selectedRestaurant.id)}
          onToggleFavorite={() => toggleFavorite(selectedRestaurant.id)}
        />
      ) : (
        <>
          {currentPage === 'home' && (
            <HomePage 
              userProfile={userProfile!} 
              onRestaurantSelect={handleRestaurantSelect}
              favoriteIds={favorites}
              onToggleFavorite={(id) => toggleFavorite(id)}
            />
          )}
          {currentPage === 'favorites' && (
            <FavoritesPage
              userProfile={userProfile!}
              favoriteIds={favorites}
              onRestaurantSelect={handleRestaurantSelect}
              onToggleFavorite={(id) => toggleFavorite(id)}
            />
          )}
          {currentPage === 'support' && <FeedbackSupport />}
          {currentPage === 'account' && (
            <MyPage 
              userProfile={userProfile!}
              onProfileUpdate={handleProfileUpdate}
            />
          )}
        </>
      )}
      
      {!selectedRestaurant && (
        <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}

export default App;
