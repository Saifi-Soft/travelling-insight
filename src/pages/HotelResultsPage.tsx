
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TravelSearch from '@/components/travel/TravelSearch';
import HotelResults from '@/components/travel/HotelResults';

const HotelResultsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-10">
          <h1 className="text-3xl font-bold mb-6">Hotels</h1>
          <TravelSearch type="hotels" />
          <HotelResults />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HotelResultsPage;
