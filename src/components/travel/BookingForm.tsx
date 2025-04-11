
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Check, CreditCard, User, Mail, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data that would come from affiliate API
const MOCK_HOTELS = {
  "hotel-1": {
    id: "hotel-1",
    name: "Grand Plaza Hotel",
    location: "Downtown Dubai",
    price: 199,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDI%3D&auto=format&fit=crop&w=800&q=60",
    rating: 4.8
  },
  "hotel-2": {
    id: "hotel-2",
    name: "Ocean View Resort",
    location: "Palm Jumeirah",
    price: 299,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsfGVufDB8fDB8fHwy&auto=format&fit=crop&w=800&q=60",
    rating: 4.9
  },
  "hotel-3": {
    id: "hotel-3",
    name: "Desert Oasis Inn",
    location: "Al Qudra",
    price: 159,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWx8ZW58MHx8MHx8fDI%3D&auto=format&fit=crop&w=800&q=60",
    rating: 4.5
  }
};

const MOCK_FLIGHTS = {
  "flight-1": {
    id: "flight-1",
    airline: "Emirates",
    flightNumber: "EK083",
    departure: {
      code: "DXB",
      city: "Dubai",
      time: "08:45"
    },
    arrival: {
      code: "LHR",
      city: "London",
      time: "13:15"
    },
    price: 850,
    currency: "USD"
  },
  "flight-2": {
    id: "flight-2",
    airline: "British Airways",
    flightNumber: "BA106",
    price: 795,
    currency: "USD"
  },
  "flight-3": {
    id: "flight-3",
    airline: "Qatar Airways",
    flightNumber: "QR009",
    price: 720,
    currency: "USD"
  }
};

interface BookingFormProps {
  type: 'hotel' | 'flight';
}

const BookingForm = ({ type }: BookingFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Simulate loading data from the affiliate API
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (type === 'hotel' && id) {
          setItem(MOCK_HOTELS[id as keyof typeof MOCK_HOTELS]);
        } else if (type === 'flight' && id) {
          setItem(MOCK_FLIGHTS[id as keyof typeof MOCK_FLIGHTS]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading booking details:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to the affiliate API
      // with proper tracking parameters for commission attribution
      console.log("Booking submitted:", { 
        itemId: id, 
        itemType: type, 
        ...formData 
      });
      
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Booking Confirmed!",
        description: `Your ${type === 'hotel' ? 'room' : 'flight'} has been successfully booked.`,
        duration: 5000,
      });
      
      // Navigate to confirmation page
      navigate(`/travel/confirmation/${type}/${id}`, { 
        state: { 
          bookingId: `BK${Math.floor(100000 + Math.random() * 900000)}`,
          itemDetails: item,
          customerName: `${formData.firstName} ${formData.lastName}`
        }
      });
      
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was a problem processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-64 w-full mb-8 rounded-lg" />
        
        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>Item Not Found</CardTitle>
          <CardDescription>
            We couldn't find the {type} you're looking for. It may have been removed or the URL is incorrect.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button onClick={() => navigate(`/travel/${type}s`)}>
            Back to Search
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {type === 'hotel' ? 'Complete Your Hotel Booking' : 'Complete Your Flight Booking'}
      </h2>
      
      {/* Item Summary */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {type === 'hotel' && (
              <div className="md:w-1/3">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{item.name}</h3>
              {type === 'hotel' ? (
                <p className="text-muted-foreground mb-2">{item.location}</p>
              ) : (
                <p className="text-muted-foreground mb-2">
                  {item.airline} · {item.flightNumber}
                  {item.departure && (
                    <span> · {item.departure.city} to {item.arrival.city}</span>
                  )}
                </p>
              )}
              
              <div className="mt-4">
                <div className="text-2xl font-bold">
                  ${item.price} <span className="text-sm font-normal text-muted-foreground">
                    {type === 'hotel' ? 'per night' : 'per person'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Booking Form */}
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Guest Details</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    className="pl-10"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Smith"
                    className="pl-10"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.smith@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <Button type="button" onClick={() => {
              const paymentTab = document.querySelector('[data-value="payment"]') as HTMLElement;
              if (paymentTab) paymentTab.click();
            }}>
              Continue to Payment
            </Button>
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="pl-10"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  maxLength={4}
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Confirm Booking
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              By clicking "Confirm Booking", you agree to our terms and conditions and privacy policy.
              Your payment will be processed securely.
            </p>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default BookingForm;
