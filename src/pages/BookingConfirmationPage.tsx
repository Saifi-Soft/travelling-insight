
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingConfirmation from '@/components/travel/BookingConfirmation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Hotel, HelpingHand, Home } from 'lucide-react';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const bookingType = type === 'hotel' ? 'hotel' : type === 'flight' ? 'flight' : 'guide';
  
  const handleTabChange = (value: string) => {
    if (value === 'hotels') {
      navigate('/travel/hotels');
    } else if (value === 'flights') {
      navigate('/travel/flights');
    } else if (value === 'guides') {
      navigate('/travel/guides');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Booking Confirmed</h1>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" /> Back to Homepage
            </Button>
          </div>
          
          <Tabs defaultValue={bookingType === 'hotel' ? 'hotels' : bookingType === 'flight' ? 'flights' : 'guides'} onValueChange={handleTabChange}>
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
          
          <BookingConfirmation type={bookingType as 'hotel' | 'flight' | 'guide'} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingConfirmationPage;
