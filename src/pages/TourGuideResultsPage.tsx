
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TravelSearch from '@/components/travel/TravelSearch';
import TourGuideResults from '@/components/travel/TourGuideResults';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Hotel, HelpingHand, ArrowLeft } from 'lucide-react';
import HeaderAd from '@/components/ads/HeaderAd';
import FooterAd from '@/components/ads/FooterAd';

const TourGuideResultsPage = () => {
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    if (value === 'hotels') {
      navigate('/travel/hotels');
    } else if (value === 'flights') {
      navigate('/travel/flights');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Tour Guides</h1>
            <Button variant="outline" onClick={() => navigate('/travel/planner')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Planner
            </Button>
          </div>
          
          {/* First ad styled with a nice background */}
          <div className="bg-primary/5 rounded-lg p-4 mb-6">
            <HeaderAd />
          </div>
          
          <Tabs defaultValue="guides" onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="flights">
                <Plane className="mr-2 h-4 w-4" /> Flights
              </TabsTrigger>
              <TabsTrigger value="hotels">
                <Hotel className="mr-2 h-4 w-4" /> Hotels
              </TabsTrigger>
              <TabsTrigger value="guides">
                <HelpingHand className="mr-2 h-4 w-4" /> Tour Guides
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <TravelSearch type="guides" />
          <div className="mt-8">
            <TourGuideResults />
          </div>
          
          {/* Second ad styled with a nice background */}
          <div className="bg-secondary/5 rounded-lg p-4 mt-8">
            <FooterAd />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TourGuideResultsPage;
