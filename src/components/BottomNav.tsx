import { Home, Heart, HelpCircle, User } from 'lucide-react';

interface BottomNavProps {
  currentPage: 'home' | 'favorites' | 'support' | 'account';
  onPageChange: (page: 'home' | 'favorites' | 'support' | 'account') => void;
}

export function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'support', icon: HelpCircle, label: 'Support' },
    { id: 'account', icon: User, label: 'Account' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-inset-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors"
            >
              <Icon 
                className={`size-5 ${
                  isActive ? 'text-orange-500' : 'text-gray-400'
                }`}
              />
              <span 
                className={`text-xs ${
                  isActive ? 'text-orange-500' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}