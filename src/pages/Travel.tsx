
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TravelSearch from '@/components/travel/TravelSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Travel = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-10">
          <h1 className="text-3xl font-bold mb-6">Plan Your Perfect Trip</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Search and book the best deals on flights, hotels, and experiences without ever leaving our site.
          </p>
          
          <Tabs defaultValue="hotels" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="flights">Flights</TabsTrigger>
            </TabsList>
            <TabsContent value="hotels" className="mt-6">
              <TravelSearch type="hotels" />
            </TabsContent>
            <TabsContent value="flights" className="mt-6">
              <TravelSearch type="flights" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Travel;
