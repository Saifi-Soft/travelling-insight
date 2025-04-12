
import React, { useEffect } from 'react';
import GoogleAdUnit from './GoogleAdUnit';
import { useQuery } from '@tanstack/react-query';
import { adPlacementsApi } from '@/api/adService';
import { toast } from '@/components/ui/use-toast';

interface BetweenPostsAdProps {
  className?: string;
}

const BetweenPostsAd: React.FC<BetweenPostsAdProps> = ({ className = '' }) => {
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
          adFormat="auto"
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
    <div className={`ad-container py-4 my-6 bg-gray-50 rounded-md ${className}`}>
      <p className="text-xs text-center text-gray-500 mb-2">Advertisement</p>
      <GoogleAdUnit 
        adSlot={adPlacement.slot}
        adFormat={adPlacement.format}
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
