
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
        
        {/* First ad placed after hero section */}
        <div className="py-6 bg-gray-50">
          <HeaderAd className="max-w-5xl mx-auto" />
        </div>
        
        <FeaturedPosts />
        <TrendingTopics />
        
        {/* Second ad placed at the bottom of content */}
        <div className="py-6 bg-gray-50 mt-12">
          <FooterAd className="max-w-5xl mx-auto" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
