
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingForm from '@/components/travel/BookingForm';
import GuideBookingForm from '@/components/travel/GuideBookingForm';

const BookingPage = () => {
  const { type, id } = useParams<{ type: string, id: string }>();
  const bookingType = type === 'hotel' ? 'hotel' : type === 'flight' ? 'flight' : 'guide';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-10">
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
