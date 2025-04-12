
import React, { useEffect, useRef, useState } from 'react';

interface GoogleAdUnitProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid';
  responsive?: boolean;
  className?: string;
  adStyle?: React.CSSProperties;
  fallbackContent?: React.ReactNode;
  width?: number;
  height?: number;
  testMode?: boolean;
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
  width,
  height,
  testMode = false,
}: GoogleAdUnitProps) => {
  const adRef = useRef<HTMLElement>(null);
  const adRendered = useRef<boolean>(false);
  const [adError, setAdError] = useState<boolean>(false);

  useEffect(() => {
    try {
      // Initialize adsbygoogle if it hasn't been already
      if (!window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || [];
      }

      if (adRef.current && !adRendered.current) {
        // Set a timeout to ensure the ad loads after component mount
        const timer = setTimeout(() => {
          try {
            window.adsbygoogle.push({});
            adRendered.current = true;
            console.log('Ad pushed to queue:', adSlot, 'format:', adFormat);
          } catch (error) {
            console.error('Error pushing ad to queue:', error);
            setAdError(true);
          }
        }, 100);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error loading Google AdSense ad:', error);
      setAdError(true);
    }
  }, [adSlot, adFormat]);

  const baseStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    overflow: 'hidden',
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
    ...adStyle
  };

  // Use a data-ad-test attribute in development/test mode
  const testAttributes = testMode ? { 'data-adtest': 'on' } : {};

  if (adError && fallbackContent) {
    return <div className={`google-ad-fallback ${className}`}>{fallbackContent}</div>;
  }

  return (
    <div className={`google-ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={baseStyle}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your actual AdSense publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? "true" : "false"}
        ref={adRef as React.LegacyRef<HTMLModElement>}
        {...testAttributes}
      />
      {fallbackContent && adRendered.current === false && (
        <div className="ad-loading">{fallbackContent}</div>
      )}
    </div>
  );
};

export default GoogleAdUnit;
