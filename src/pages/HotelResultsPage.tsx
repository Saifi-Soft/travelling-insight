
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TravelSearch from '@/components/travel/TravelSearch';
import HotelResults from '@/components/travel/HotelResults';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Hotel, HelpingHand, ArrowLeft } from 'lucide-react';

const HotelResultsPage = () => {
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    if (value === 'flights') {
      navigate('/travel/flights');
    } else if (value === 'guides') {
      navigate('/travel/guides');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Hotels</h1>
            <Button variant="outline" onClick={() => navigate('/travel/planner')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Planner
            </Button>
          </div>
          
          <Tabs defaultValue="hotels" onValueChange={handleTabChange}>
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
          
          <TravelSearch type="hotels" />
          <HotelResults />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HotelResultsPage;
