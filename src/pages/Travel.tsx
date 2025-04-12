
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TravelSearch from '@/components/travel/TravelSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plane, Hotel, HelpingHand, ArrowRight } from 'lucide-react';
import HeaderAd from '@/components/ads/HeaderAd';
import FooterAd from '@/components/ads/FooterAd';

const Travel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeaderAd />
      <main className="flex-grow">
        <div className="relative overflow-hidden bg-gradient-to-b from-primary/20 to-background py-16 lg:py-24">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')] bg-cover bg-center opacity-20"></div>
          
          <div className="container-custom relative z-10">
            <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in max-w-3xl mx-auto">
              <h1 className="font-bold text-4xl md:text-5xl tracking-tighter">
                Plan Your Perfect Trip
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Search and book the best deals on flights, hotels, and tour guides without ever leaving our site.
              </p>
            </div>
          </div>
        </div>
        
        <div className="container-custom py-10">
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
        </div>
      </main>
      <FooterAd />
      <Footer />
    </div>
  );
};

export default Travel;
