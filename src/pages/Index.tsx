
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
      <HeaderAd />
      <main className="flex-grow">
        <Hero />
        <FeaturedPosts />
        <TrendingTopics />
      </main>
      <FooterAd />
      <Footer />
    </div>
  );
};

export default Index;
