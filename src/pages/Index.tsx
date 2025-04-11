
import Hero from '@/components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';
import TrendingTopics from '@/components/TrendingTopics';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedPosts />
        <TrendingTopics />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
