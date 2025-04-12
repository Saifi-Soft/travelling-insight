
import React, { useEffect, useState } from 'react';
import GoogleAdUnit from './GoogleAdUnit';
import { useQuery } from '@tanstack/react-query';
import { adPlacementsApi } from '@/api/adService';
import { toast } from '@/components/ui/use-toast';

interface BetweenPostsAdProps {
  className?: string;
  variant?: 'default' | 'compact';
}

// Define possible ad formats for testing
const AD_FORMATS = ['auto', 'rectangle', 'horizontal', 'vertical'] as const;
type AdFormat = typeof AD_FORMATS[number];

const BetweenPostsAd: React.FC<BetweenPostsAdProps> = ({ className = '', variant = 'default' }) => {
  const [testingFormat, setTestingFormat] = useState<AdFormat>('auto');
  
  // Set up A/B testing by randomly selecting a format on mount
  useEffect(() => {
    // Randomly select an ad format to test
    const randomFormat = AD_FORMATS[Math.floor(Math.random() * AD_FORMATS.length)];
    setTestingFormat(randomFormat as AdFormat);
    
    // Log the format being tested for analytics
    console.log('Testing ad format:', randomFormat);
  }, []);

  const { data: adPlacements = [], isLoading, error } = useQuery({
    queryKey: ['adPlacements', 'between-posts'],
    queryFn: async () => {
      const allPlacements = await adPlacementsApi.getAll();
      return allPlacements.filter(ad => ad.type === 'between-posts' && ad.isEnabled);
    },
  });

  useEffect(() => {
    // Log for debugging
    console.log('Between posts ad placements:', adPlacements);
    
    if (error) {
      console.error('Error fetching ad placements:', error);
      toast({
        title: "Error loading ads",
        description: "There was a problem loading advertisements",
        variant: "destructive"
      });
    }
  }, [adPlacements, error]);

  // If no enabled ad placements, use a fallback ad slot
  if (adPlacements.length === 0 && !isLoading) {
    return (
      <div className={`ad-container py-4 my-6 bg-gray-50 rounded-md ${className}`}>
        <p className="text-xs text-center text-gray-500 mb-2">Advertisement</p>
        <GoogleAdUnit 
          adSlot="1122334455" // Fallback ad slot
          adFormat={testingFormat as "auto" | "rectangle" | "horizontal" | "vertical"}
          responsive={true}
          className="mx-auto"
          fallbackContent={
            <div className="text-center text-gray-400 italic text-sm py-2">
              Ad content is loading...
            </div>
          }
        />
      </div>
    );
  }

  if (adPlacements.length === 0) return null;

  // Get a random ad placement from the available ones
  const randomIndex = Math.floor(Math.random() * adPlacements.length);
  const adPlacement = adPlacements[randomIndex];

  return (
    <div className={`ad-container py-4 my-6 bg-gray-50 rounded-md ${className} ${variant === 'compact' ? 'max-w-md mx-auto' : ''}`}>
      <p className="text-xs text-center text-gray-500 mb-2">Advertisement</p>
      <GoogleAdUnit 
        adSlot={adPlacement.slot}
        // Use either the placement's format or our test format
        adFormat={(adPlacement.format === 'auto' ? testingFormat : adPlacement.format) as "auto" | "rectangle" | "horizontal" | "vertical"}
        responsive={adPlacement.responsive}
        className="mx-auto"
        fallbackContent={
          <div className="text-center text-gray-400 italic text-sm py-2">
            Ad content is loading...
          </div>
        }
      />
    </div>
  );
};

export default BetweenPostsAd;
