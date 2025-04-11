
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingForm from '@/components/travel/BookingForm';

const BookingPage = () => {
  const { type, id } = useParams<{ type: string, id: string }>();
  const bookingType = type === 'hotel' ? 'hotel' : 'flight';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-10">
          <BookingForm type={bookingType as 'hotel' | 'flight'} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
