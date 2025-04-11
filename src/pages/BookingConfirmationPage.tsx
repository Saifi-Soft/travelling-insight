
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingConfirmation from '@/components/travel/BookingConfirmation';

const BookingConfirmationPage = () => {
  const { type } = useParams<{ type: string }>();
  const bookingType = type === 'hotel' ? 'hotel' : 'flight';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-10">
          <BookingConfirmation type={bookingType as 'hotel' | 'flight'} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingConfirmationPage;
