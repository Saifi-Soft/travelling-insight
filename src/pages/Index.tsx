
import Hero from '@/components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';
import TrendingTopics from '@/components/TrendingTopics';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeaderAd from '@/components/ads/HeaderAd';
import FooterAd from '@/components/ads/FooterAd';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        {/* First ad placed after hero section with visual enhancement */}
        <div className="py-6 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <HeaderAd className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-md" />
          </div>
        </div>
        
        <FeaturedPosts />
        <TrendingTopics />
        
        {/* Second ad placed at the bottom of content with visual enhancement */}
        <div className="py-6 bg-gradient-to-t from-gray-100 to-background mt-12">
          <div className="container mx-auto px-4">
            <FooterAd className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-md" />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
