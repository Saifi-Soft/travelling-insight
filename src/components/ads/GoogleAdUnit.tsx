
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
  // Update the ref type to HTMLInsElement which is appropriate for <ins> tag
  const adRef = useRef<HTMLElement>(null);
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
        ref={adRef}
        className="adsbygoogle"
        style={baseStyle}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your actual AdSense publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
      {fallbackContent}
    </div>
  );
};

export default GoogleAdUnit;
