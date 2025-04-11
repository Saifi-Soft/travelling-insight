
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingForm from '@/components/travel/BookingForm';
import GuideBookingForm from '@/components/travel/GuideBookingForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Hotel, HelpingHand, ArrowLeft } from 'lucide-react';

const BookingPage = () => {
  const navigate = useNavigate();
  const { type, id } = useParams<{ type: string, id: string }>();
  const bookingType = type === 'hotel' ? 'hotel' : type === 'flight' ? 'flight' : 'guide';
  
  const handleTabChange = (value: string) => {
    // When changing tabs, navigate to the results page for that service
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
            <h1 className="text-3xl font-bold">{bookingType === 'hotel' ? 'Hotel' : bookingType === 'flight' ? 'Flight' : 'Guide'} Booking</h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Results
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
          
          {bookingType === 'guide' ? (
            <GuideBookingForm type={bookingType} />
          ) : (
            <BookingForm type={bookingType as 'hotel' | 'flight'} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
