
import React from 'react';
import GoogleAdUnit from './GoogleAdUnit';
import { useQuery } from '@tanstack/react-query';
import { adPlacementsApi } from '@/api/adService';

interface HeaderAdProps {
  className?: string;
}

const HeaderAd: React.FC<HeaderAdProps> = ({ className = '' }) => {
  const { data: adPlacements = [], isLoading } = useQuery({
    queryKey: ['adPlacements', 'header'],
    queryFn: () => adPlacementsApi.getByType('header'),
  });

  // If no enabled header ad placements or still loading, don't show anything
  if (adPlacements.length === 0 || isLoading) return null;

  // Get a random header ad
  const randomIndex = Math.floor(Math.random() * adPlacements.length);
  const adPlacement = adPlacements[randomIndex];

  return (
    <div className={`w-full bg-gray-50 py-2 ${className}`}>
      <div className="container mx-auto px-4">
        <GoogleAdUnit 
          adSlot={adPlacement.slot}
          adFormat="horizontal"
          responsive={true}
          className="mx-auto"
          fallbackContent={
            <div className="text-center text-gray-400 italic text-sm h-16 flex items-center justify-center">
              Advertisement
            </div>
          }
        />
      </div>
    </div>
  );
};

export default HeaderAd;
