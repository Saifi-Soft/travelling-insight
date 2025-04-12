
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeaderAd from "@/components/ads/HeaderAd";
import FooterAd from "@/components/ads/FooterAd";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* First ad placed at the top with a nice background */}
        <div className="py-4 bg-gray-50">
          <HeaderAd className="max-w-5xl mx-auto" />
        </div>
        
        <div className="flex items-center justify-center py-16 bg-gradient-to-b from-background to-gray-50">
          <div className="text-center max-w-md px-6">
            <h1 className="text-6xl font-bold mb-6 text-primary">404</h1>
            <p className="text-2xl text-gray-700 mb-6">Oops! We can't find that page</p>
            <p className="text-gray-600 mb-8">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <a 
              href="/" 
              className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Homepage
            </a>
          </div>
        </div>
        
        {/* Second ad placed at bottom with a gradient background */}
        <div className="py-4 bg-gradient-to-t from-background to-gray-50/50 mt-auto">
          <FooterAd className="max-w-5xl mx-auto" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
