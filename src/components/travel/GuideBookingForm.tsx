
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Check, CreditCard, User, Mail, Phone, Calendar, MapPin, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

// Mock data for guides
const MOCK_GUIDES = {
  "guide-1": {
    id: "guide-1",
    name: "Elena Martinez",
    location: "Barcelona, Spain",
    languages: ["English", "Spanish", "Catalan"],
    price: 75,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    rating: 4.9,
    reviewCount: 127,
    specialties: ["Architecture", "Food", "History"],
    availability: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"]
  },
  "guide-2": {
    id: "guide-2",
    name: "Hiroshi Tanaka",
    location: "Kyoto, Japan",
    languages: ["English", "Japanese"],
    price: 89,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    rating: 4.8,
    reviewCount: 92,
    specialties: ["Traditional Culture", "Gardens", "Tea Ceremony"],
    availability: ["Tuesday", "Wednesday", "Friday", "Sunday"]
  }
};

interface GuideBookingFormProps {
  type: 'guide';
}

const GuideBookingForm = ({ type }: GuideBookingFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [guide, setGuide] = useState<any>(null);
  const [tourDate, setTourDate] = useState<Date | undefined>(new Date());
  const [hours, setHours] = useState(3);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
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
        
        if (id) {
          setGuide(MOCK_GUIDES[id as keyof typeof MOCK_GUIDES]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading guide details:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to the affiliate API
      console.log("Tour guide booking submitted:", { 
        guideId: id, 
        tourDate: format(tourDate || new Date(), 'yyyy-MM-dd'),
        hours,
        totalCost: guide.price * hours,
        ...formData 
      });
      
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Booking Confirmed!",
        description: `Your tour with ${guide.name} has been successfully booked.`,
        duration: 5000,
      });
      
      // Navigate to confirmation page
      navigate(`/travel/confirmation/guide/${id}`, { 
        state: { 
          bookingId: `BK${Math.floor(100000 + Math.random() * 900000)}`,
          itemDetails: {
            ...guide,
            bookedDate: format(tourDate || new Date(), 'yyyy-MM-dd'),
            hours,
            totalPrice: guide.price * hours
          },
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

  if (!guide) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>Guide Not Found</CardTitle>
          <CardDescription>
            We couldn't find the tour guide you're looking for. They may have been removed or the URL is incorrect.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button onClick={() => navigate('/travel/guides')}>
            Back to Guide Search
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Book Your Tour Guide</h2>
      
      {/* Guide Summary */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img 
                src={guide.image} 
                alt={guide.name} 
                className="w-full h-48 md:h-64 object-cover rounded-lg"
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{guide.name}</h3>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{guide.location}</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {guide.specialties.map((specialty: string) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Available: {guide.availability.join(', ')}</span>
                </div>
                
                <div className="mt-4">
                  <div className="text-2xl font-bold">
                    ${guide.price} <span className="text-sm font-normal text-muted-foreground">per hour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Booking Form */}
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="tour" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tour">Tour Details</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tour" className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label>Tour Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full md:w-[300px] justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {tourDate ? format(tourDate, 'PPP') : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={tourDate}
                    onSelect={setTourDate}
                    initialFocus
                    disabled={(date) => {
                      // Disable dates in the past
                      const isPastDate = date < new Date();
                      
                      // Get day of week (0 = Sunday, 1 = Monday, etc.)
                      const dayOfWeek = date.getDay();
                      
                      // Create map of days available
                      const availabilityMap: Record<string, number> = {
                        'Sunday': 0,
                        'Monday': 1,
                        'Tuesday': 2,
                        'Wednesday': 3,
                        'Thursday': 4,
                        'Friday': 5,
                        'Saturday': 6
                      };
                      
                      // Convert guide availability to day numbers
                      const availableDays = guide.availability.map(
                        (day: string) => availabilityMap[day]
                      );
                      
                      // Check if day is available
                      const isAvailable = availableDays.includes(dayOfWeek);
                      
                      return isPastDate || !isAvailable;
                    }}
                  />
                </PopoverContent>
              </Popover>
              <div className="text-sm text-muted-foreground mt-1">
                Note: Only days when the guide is available are selectable.
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tour Duration</Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setHours(prev => (prev > 2 ? prev - 1 : 2))}
                  disabled={hours <= 2}
                  className="rounded-r-none"
                >
                  -
                </Button>
                <div className="flex items-center justify-center border-y px-4 h-10 w-16 text-center">
                  {hours}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setHours(prev => (prev < 8 ? prev + 1 : 8))}
                  disabled={hours >= 8}
                  className="rounded-l-none"
                >
                  +
                </Button>
                <span className="ml-3">hours</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                placeholder="Let your guide know about any specific interests, needs, or places you'd like to visit."
                rows={4}
                value={formData.specialRequests}
                onChange={handleChange}
              />
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span>Guide rate</span>
                <span>${guide.price} × {hours} hours</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span>${guide.price * hours}</span>
              </div>
            </div>
            
            <Button type="button" onClick={() => {
              const contactTab = document.querySelector('[data-value="contact"]') as HTMLElement;
              if (contactTab) contactTab.click();
            }}>
              Continue to Contact Information
            </Button>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-6 mt-6">
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
            
            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span>Guide rate</span>
                <span>${guide.price} × {hours} hours</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span>${guide.price * hours}</span>
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

export default GuideBookingForm;
