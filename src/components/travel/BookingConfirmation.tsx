
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Calendar, MapPin, Plane, User, Download, Share, HelpingHand, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BookingConfirmationProps {
  type: 'hotel' | 'flight' | 'guide';
}

const BookingConfirmation = ({ type }: BookingConfirmationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Get data passed from the booking form
  const bookingData = location.state || {
    bookingId: 'Unknown',
    itemDetails: null,
    customerName: 'Guest'
  };
  
  const { bookingId, itemDetails, customerName } = bookingData;
  
  if (!itemDetails) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>Booking Information Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            We couldn't find your booking information. Please check your bookings in your account.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate('/travel')}>Return to Travel</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground">
          Your {type === 'guide' ? 'tour guide' : type} has been successfully booked. Your booking reference is <strong>{bookingId}</strong>.
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {type === 'hotel' ? 'Hotel Details' : type === 'flight' ? 'Flight Details' : 'Tour Guide Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {type === 'hotel' ? (
            <div className="grid gap-4">
              <div className="flex flex-col md:flex-row items-start gap-4">
                {itemDetails.image && (
                  <div className="md:w-1/3">
                    <img 
                      src={itemDetails.image} 
                      alt={itemDetails.name} 
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{itemDetails.name}</h3>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" /> 
                    <span>{itemDetails.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <div className="text-sm text-muted-foreground">Check-in</div>
                  <div className="font-medium">April 15, 2025</div>
                  <div className="text-sm">From 3:00 PM</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Check-out</div>
                  <div className="font-medium">April 18, 2025</div>
                  <div className="text-sm">Until 11:00 AM</div>
                </div>
              </div>
            </div>
          ) : type === 'flight' ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">
                      {itemDetails.airline} · {itemDetails.flightNumber}
                    </h3>
                    <div className="text-sm text-muted-foreground">Economy Class</div>
                  </div>
                  <div className="text-sm font-medium">April 15, 2025</div>
                </div>
                
                {itemDetails.departure && (
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="text-center">
                      <div className="text-xl font-bold">{itemDetails.departure.time}</div>
                      <div className="text-sm font-medium">{itemDetails.departure.code}</div>
                      <div className="text-xs text-muted-foreground">{itemDetails.departure.city}</div>
                    </div>
                    
                    <div className="flex-1 mx-4 px-6">
                      <div className="relative">
                        <div className="border-t border-dashed border-gray-300 absolute w-full top-4"></div>
                        <div className="flex justify-center">
                          <Plane className="h-8 w-8 rotate-90 bg-background z-10 p-1" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xl font-bold">{itemDetails.arrival.time}</div>
                      <div className="text-sm font-medium">{itemDetails.arrival.code}</div>
                      <div className="text-xs text-muted-foreground">{itemDetails.arrival.city}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-start gap-4">
                {itemDetails.image && (
                  <div className="md:w-1/3">
                    <img 
                      src={itemDetails.image} 
                      alt={itemDetails.name} 
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{itemDetails.name}</h3>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" /> 
                    <span>{itemDetails.location}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {itemDetails.specialties?.map((specialty: string) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <div className="text-sm text-muted-foreground">Tour Date</div>
                  <div className="flex items-center font-medium">
                    <Calendar className="h-4 w-4 mr-2" />
                    {itemDetails.bookedDate || 'April 15, 2025'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tour Duration</div>
                  <div className="flex items-center font-medium">
                    <Clock className="h-4 w-4 mr-2" />
                    {itemDetails.hours || 3} hours
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-1">
                  <div className="text-sm text-muted-foreground">Total Cost</div>
                  <div className="font-medium">${itemDetails.totalPrice || itemDetails.price * 3}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{customerName}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Booked on {new Date().toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="flex-1" variant="outline" onClick={() => navigate('/travel')}>
          Return to Travel
        </Button>
        <Button className="flex-1">
          <Download className="mr-2 h-4 w-4" /> Download Receipt
        </Button>
        <Button className="flex-1" variant="secondary">
          <Share className="mr-2 h-4 w-4" /> Share Itinerary
        </Button>
      </div>
      
      <div className="text-center mt-10 text-sm text-muted-foreground">
        <p>Need help with your booking? Contact us at support@travelblog.com</p>
        <p className="mt-1">Booking ID: {bookingId}</p>
      </div>
    </div>
  );
};

export default BookingConfirmation;
