import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { hotelApi, flightApi, guideApi } from '@/api/travelService';
import { Check, ExternalLink, Loader2 } from 'lucide-react';

interface BookingConfirmationProps {
  type: 'hotel' | 'flight' | 'guide';
}

const BookingConfirmation = ({ type }: BookingConfirmationProps) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<any>(null);
  const [affiliateUrl, setAffiliateUrl] = useState<string | null>(null);

  // Get data from state if available, otherwise load from API
  const bookingData = location.state || {};
  const bookingId = bookingData.bookingId || `BK${Math.floor(100000 + Math.random() * 900000)}`;
  
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!id) {
        setError('Booking ID not found');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // If we have item details in state, use them
        if (bookingData.itemDetails) {
          setItem(bookingData.itemDetails);
          setAffiliateUrl(bookingData.itemDetails.affiliateUrl);
          setLoading(false);
          return;
        }
        
        // Otherwise fetch from API
        if (type === 'hotel') {
          const response = await hotelApi.getHotelDetails(id);
          setItem(response.hotel);
          setAffiliateUrl(response.hotel.affiliateUrl);
        } else if (type === 'flight') {
          const response = await flightApi.getFlightDetails(id);
          setItem(response.flight);
          setAffiliateUrl(response.flight.affiliateUrl);
        } else if (type === 'guide') {
          const response = await guideApi.getGuideDetails(id);
          setItem(response.guide);
          setAffiliateUrl(response.guide.affiliateUrl);
        }
        
      } catch (error) {
        console.error('Error loading booking details:', error);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItemDetails();
  }, [id, type, bookingData]);
  
  const handleViewDetails = () => {
    if (affiliateUrl) {
      window.open(affiliateUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-center text-muted-foreground">Loading booking details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-red-500">Something went wrong</CardTitle>
          <CardDescription>{error || 'Booking details not found'}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate('/travel')}>Return to Travel Search</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-600">Booking Confirmed!</CardTitle>
        <CardDescription className="text-base">
          Your booking reference: <span className="font-medium">{bookingId}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-medium mb-2">Booking Details</h3>
          
          {type === 'hotel' && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hotel:</span>
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>{item.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">${item.price} per night</span>
              </div>
            </div>
          )}
          
          {type === 'flight' && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Airline:</span>
                <span className="font-medium">{item.airline} {item.flightNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route:</span>
                <span>{item.departure?.city} to {item.arrival?.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">${item.price} per person</span>
              </div>
            </div>
          )}
          
          {type === 'guide' && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guide:</span>
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>{item.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">${item.price} per hour</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-medium mb-2">Customer Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{bookingData.customerName || 'Guest User'}</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="text-center space-y-4">
          <p>Thank you for booking through NomadJourney!</p>
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent with all the details of your booking.
          </p>
          
          {affiliateUrl && (
            <Button onClick={handleViewDetails} variant="outline" className="mt-2">
              View Full Details <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={() => navigate('/')}>
          Return Home
        </Button>
        <Button onClick={() => navigate('/travel/planner')}>
          Plan Another Trip
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingConfirmation;
