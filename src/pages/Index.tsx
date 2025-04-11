
import Hero from '@/components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';
import TrendingTopics from '@/components/TrendingTopics';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Hotel, HelpingHand, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TravelSearch from '@/components/travel/TravelSearch';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Plan Your Travel Section */}
        <div className="py-16 bg-secondary/20">
          <div className="container-custom">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Plan Your Travel</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Search and book the best deals on flights, hotels, and tour guides without ever leaving our site.
              </p>
            </div>
            
            <Tabs defaultValue="hotels" className="w-full">
              <TabsList className="grid w-full md:w-[600px] grid-cols-3 mx-auto mb-8">
                <TabsTrigger value="hotels">
                  <Hotel className="mr-2 h-4 w-4" /> Hotels
                </TabsTrigger>
                <TabsTrigger value="flights">
                  <Plane className="mr-2 h-4 w-4" /> Flights
                </TabsTrigger>
                <TabsTrigger value="guides">
                  <HelpingHand className="mr-2 h-4 w-4" /> Tour Guides
                </TabsTrigger>
              </TabsList>
              <TabsContent value="hotels" className="mt-6">
                <TravelSearch type="hotels" />
              </TabsContent>
              <TabsContent value="flights" className="mt-6">
                <TravelSearch type="flights" />
              </TabsContent>
              <TabsContent value="guides" className="mt-6">
                <TravelSearch type="guides" />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-center mt-8">
              <Button 
                onClick={() => navigate("/travel/planner")} 
                className="bg-primary hover:bg-primary/90"
              >
                Plan Complete Trip
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <FeaturedPosts />
        <TrendingTopics />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
