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

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'favorites' | 'support' | 'account'>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    // Check if user has completed onboarding
    const savedProfile = localStorage.getItem('kneweat-profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setIsOnboarded(true);
    }
    
    // Load favorites
    const savedFavorites = localStorage.getItem('kneweat-favorites');
    if (savedFavorites) {
      setFavoriteIds(JSON.parse(savedFavorites));
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsOnboarded(true);
    localStorage.setItem('kneweat-profile', JSON.stringify(profile));
  };

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('kneweat-profile', JSON.stringify(profile));
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleBackToHome = () => {
    setSelectedRestaurant(null);
  };

  const toggleFavorite = (restaurantId: string) => {
    const newFavorites = favoriteIds.includes(restaurantId)
      ? favoriteIds.filter(id => id !== restaurantId)
      : [...favoriteIds, restaurantId];
    
    setFavoriteIds(newFavorites);
    localStorage.setItem('kneweat-favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (restaurantId: string) => {
    return favoriteIds.includes(restaurantId);
  };

  if (!isOnboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

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
            />
          )}
          {currentPage === 'favorites' && (
            <FavoritesPage
              userProfile={userProfile!}
              favoriteIds={favoriteIds}
              onRestaurantSelect={handleRestaurantSelect}
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