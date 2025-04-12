
import React from 'react';
import GoogleAdUnit from './GoogleAdUnit';
import { useQuery } from '@tanstack/react-query';
import { adPlacementsApi } from '@/api/adService';

interface SidebarAdProps {
  className?: string;
}

const SidebarAd: React.FC<SidebarAdProps> = ({ className = '' }) => {
  const { data: adPlacements = [] } = useQuery({
    queryKey: ['adPlacements', 'sidebar'],
    queryFn: async () => {
      const allPlacements = await adPlacementsApi.getAll();
      return allPlacements.filter(ad => ad.type === 'sidebar' && ad.isEnabled);
    },
  });

  // If no enabled sidebar ad placements, don't show anything
  if (adPlacements.length === 0) return null;

  // Get a random sidebar ad
  const randomIndex = Math.floor(Math.random() * adPlacements.length);
  const adPlacement = adPlacements[randomIndex];

  return (
    <div className={`bg-gray-50 rounded-md p-4 mb-6 ${className}`}>
      <p className="text-xs text-center text-gray-500 mb-2">Advertisement</p>
      <GoogleAdUnit 
        adSlot={adPlacement.slot}
        adFormat="vertical"
        responsive={false}
        className="mx-auto"
        width={300}
        height={600}
        fallbackContent={
          <div className="text-center text-gray-400 italic text-sm h-60 flex items-center justify-center">
            Advertisement
          </div>
        }
      />
    </div>
  );
};

export default SidebarAd;
