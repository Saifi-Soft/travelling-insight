
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adPlacementsApi } from '@/api/adService';
import GoogleAdUnit from './GoogleAdUnit';

interface PopupAdProps {
  delay?: number; // Delay in milliseconds before showing the popup
  duration?: number; // Auto-close duration in milliseconds (if provided)
}

const PopupAd: React.FC<PopupAdProps> = ({ 
  delay = 3000, 
  duration
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Fetch popup ad placement
  const { data: adPlacements = [] } = useQuery({
    queryKey: ['adPlacements', 'popup'],
    queryFn: () => adPlacementsApi.getByType('popup'),
  });

  // Show popup after specified delay
  useEffect(() => {
    // Check if user has dismissed popup in this session
    const hasUserDismissed = sessionStorage.getItem('popupAdDismissed') === 'true';
    
    if (hasUserDismissed) {
      return;
    }
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  // Auto-close functionality if duration is provided
  useEffect(() => {
    if (isVisible && duration) {
      const autoCloseTimer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      return () => clearTimeout(autoCloseTimer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsVisible(false);
    // Remember that user has dismissed the popup in this session
    sessionStorage.setItem('popupAdDismissed', 'true');
  };

  // If no enabled popup ad placements, don't render anything
  if (adPlacements.length === 0) {
    return null;
  }

  // Get the first enabled popup ad placement
  const adPlacement = adPlacements[0];

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full m-4 animate-scale-in">
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-4">
          <p className="text-xs text-center text-gray-500 mb-2">Advertisement</p>
          <GoogleAdUnit 
            adSlot={adPlacement.slot}
            adFormat="rectangle" 
            responsive={true}
            className="mx-auto"
            width={300}
            height={250}
            fallbackContent={
              <div className="text-center text-gray-400 italic text-sm py-6">
                Ad content is loading...
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PopupAd;
