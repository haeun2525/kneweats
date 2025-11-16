import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { NationalityStep } from './onboarding/NationalityStep';
import { ReligionStep } from './onboarding/ReligionStep';
import { RestrictedFoodsStep } from './onboarding/RestrictedFoodsStep';
import { DietaryPreferenceStep } from './onboarding/DietaryPreferenceStep';
import { AllergiesStep } from './onboarding/AllergiesStep';
import { CuisinesStep } from './onboarding/CuisinesStep';
import type { UserProfile } from '../App';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    nationality: '',
    religion: '',
    restrictedFoods: [],
    dietaryPreference: '',
    allergies: [],
    preferredCuisines: [],
  });

  const totalSteps = profile.religion === 'No religion or others' ? 5 : 6;

  const handleNext = () => {
    if (step === 2 && profile.religion === 'No religion or others') {
      setStep(4); // Skip restricted foods
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 4 && profile.religion === 'No religion or others') {
      setStep(2); // Skip back over restricted foods
    } else {
      setStep(step - 1);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile({ ...profile, ...updates });
  };

  const handleComplete = () => {
    onComplete(profile as UserProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-pink-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8 mt-4">
          {step > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-4 -ml-2 text-orange-600 hover:text-orange-700 hover:bg-orange-100"
            >
              <ChevronLeft className="size-4 mr-1" />
              Back
            </Button>
          )}
          
          {step === 1 && (
            <div className="text-center mb-6">
              <h1 className="text-orange-600 mb-2">Knew-eat</h1>
              <p className="text-gray-600">It's fine, just eat it!</p>
            </div>
          )}

          {/* Progress bar */}
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < step ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          {step === 1 && (
            <NationalityStep
              value={profile.nationality || ''}
              onChange={(nationality) => updateProfile({ nationality })}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <ReligionStep
              value={profile.religion || ''}
              onChange={(religion) => updateProfile({ religion, restrictedFoods: [] })}
              onNext={handleNext}
            />
          )}
          {step === 3 && (
            <RestrictedFoodsStep
              religion={profile.religion || ''}
              value={profile.restrictedFoods || []}
              onChange={(restrictedFoods) => updateProfile({ restrictedFoods })}
              onNext={handleNext}
            />
          )}
          {step === 4 && (
            <DietaryPreferenceStep
              value={profile.dietaryPreference || ''}
              onChange={(dietaryPreference) => updateProfile({ dietaryPreference })}
              onNext={handleNext}
            />
          )}
          {step === 5 && (
            <AllergiesStep
              value={profile.allergies || []}
              onChange={(allergies) => updateProfile({ allergies })}
              onNext={handleNext}
            />
          )}
          {step === 6 && (
            <CuisinesStep
              value={profile.preferredCuisines || []}
              onChange={(preferredCuisines) => updateProfile({ preferredCuisines })}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
