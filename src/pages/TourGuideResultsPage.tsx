
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TravelSearch from '@/components/travel/TravelSearch';
import TourGuideResults from '@/components/travel/TourGuideResults';

const TourGuideResultsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-10">
          <h1 className="text-3xl font-bold mb-6">Tour Guides</h1>
          <TravelSearch type="guides" />
          <div className="mt-8">
            <TourGuideResults />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TourGuideResultsPage;
