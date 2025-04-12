
import React, { useEffect, useRef } from 'react';

interface GoogleAdUnitProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  adStyle?: React.CSSProperties;
  fallbackContent?: React.ReactNode;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAdUnit = ({
  adSlot,
  adFormat = 'auto',
  responsive = true,
  className = '',
  adStyle = {},
  fallbackContent,
}: GoogleAdUnitProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const adRendered = useRef<boolean>(false);

  useEffect(() => {
    try {
      // Initialize adsbygoogle if it hasn't been already
      if (!window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || [];
      }

      if (adRef.current && !adRendered.current) {
        // Push the ad to Google's queue
        window.adsbygoogle.push({});
        adRendered.current = true;
        console.log('Ad pushed to queue:', adSlot);
      }
    } catch (error) {
      console.error('Error loading Google AdSense ad:', error);
    }
  }, [adSlot]);

  const baseStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    ...adStyle
  };

  return (
    <div className={`google-ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={baseStyle}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your actual AdSense publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? "true" : "false"}
        ref={adRef as unknown as React.LegacyRef<HTMLModElement>}
      />
      {fallbackContent}
    </div>
  );
};

export default GoogleAdUnit;
