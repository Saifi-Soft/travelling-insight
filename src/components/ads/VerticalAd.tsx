
import React from 'react';
import GoogleAdUnit from './GoogleAdUnit';
import { useQuery } from '@tanstack/react-query';
import { adPlacementsApi } from '@/api/adService';

interface VerticalAdProps {
  className?: string;
  position?: 'left' | 'right';
}

const VerticalAd: React.FC<VerticalAdProps> = ({ className = '', position = 'right' }) => {
  const { data: adPlacements = [], isLoading } = useQuery({
    queryKey: ['adPlacements', 'vertical'],
    queryFn: () => adPlacementsApi.getByType('vertical'),
  });

  // If no enabled vertical ad placements or still loading, don't show anything
  if (adPlacements.length === 0 || isLoading) return null;

  // Get a random vertical ad
  const randomIndex = Math.floor(Math.random() * adPlacements.length);
  const adPlacement = adPlacements[randomIndex];

  // Position styles
  const positionStyles = position === 'left' 
    ? 'left-4 lg:left-8' 
    : 'right-4 lg:right-8';

  return (
    <div className={`hidden lg:block fixed top-1/4 ${positionStyles} z-30 ${className}`}>
      <div className="bg-white rounded-md shadow-lg p-3">
        <p className="text-xs text-center text-gray-500 mb-2">Advertisement</p>
        <GoogleAdUnit 
          adSlot={adPlacement.slot}
          adFormat="vertical"
          responsive={false}
          width={160}
          height={600}
          className="mx-auto"
          fallbackContent={
            <div className="text-center text-gray-400 italic text-sm h-60 flex items-center justify-center border border-gray-200 bg-gray-50">
              Advertisement
            </div>
          }
        />
      </div>
    </div>
  );
};

export default VerticalAd;
