
import React from 'react';
import GoogleAdUnit from './GoogleAdUnit';
import { useQuery } from '@tanstack/react-query';
import { adPlacementsApi } from '@/api/adService';

interface BetweenPostsAdProps {
  className?: string;
}

const BetweenPostsAd: React.FC<BetweenPostsAdProps> = ({ className = '' }) => {
  const { data: adPlacements = [] } = useQuery({
    queryKey: ['adPlacements', 'between-posts'],
    queryFn: async () => {
      const allPlacements = await adPlacementsApi.getAll();
      return allPlacements.filter(ad => ad.type === 'between-posts' && ad.isEnabled);
    },
  });

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
