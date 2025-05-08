
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MapPin, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { hotelApi } from '@/api/travelService';
import { useToast } from '@/hooks/use-toast';

interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  currency: string;
  rating: number;
  image: string;
  amenities: string[];
  affiliateUrl: string;
  originalUrl: string;
}

const HotelResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const query = new URLSearchParams(location.search);
  const destination = query.get('destination') || '';
  const checkIn = query.get('checkIn') || '';
  const checkOut = query.get('checkOut') || '';
  const guests = query.get('guests') || '1';

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call our API service
      const result = await hotelApi.searchHotels({
        destination,
        checkIn,
        checkOut,
        guests: parseInt(guests, 10)
      });
      
      if (result && result.hotels) {
        setHotels(result.hotels);
      } else {
        throw new Error('No hotels returned from API');
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setError('Failed to load hotels. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load hotels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [destination, checkIn, checkOut, guests]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return stars;
  };
  
  const handleViewDeal = (hotel: Hotel) => {
    // For direct booking through our platform, navigate to our booking page
    if (hotel.originalUrl) {
      navigate(hotel.originalUrl);
    } else {
      // For affiliate links, open in new tab
      window.open(hotel.affiliateUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <Skeleton className="h-64 md:h-auto md:w-1/3" />
              <div className="p-6 flex-1">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <div className="flex space-x-2 mb-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center p-8 mt-6">
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => fetchHotels()} className="flex items-center">
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </Card>
    );
  }

  if (hotels.length === 0) {
    return (
      <Card className="text-center p-8 mt-6">
        <h3 className="text-xl font-semibold mb-2">No Hotels Found</h3>
        <p className="text-muted-foreground">
          We couldn't find any hotels matching your search criteria. Please try different dates or location.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 mt-6">
      {hotels.map((hotel) => (
        <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 h-64 md:h-auto">
              <img 
                src={hotel.image} 
                alt={hotel.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/600x400?text=Hotel+Image";
                }}
              />
            </div>
            <div className="flex-1 p-6">
              <CardHeader className="px-0 pt-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-1">{hotel.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" /> {hotel.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    {renderStars(hotel.rating)}
                    <span className="ml-2 text-sm font-medium">{hotel.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0 py-2">
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities?.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="flex items-center">
                      <Check className="h-3 w-3 mr-1" /> {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="px-0 pt-4 flex justify-between items-center border-t">
                <div>
                  <span className="text-2xl font-bold">${hotel.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">per night</span>
                </div>
                <Button onClick={() => handleViewDeal(hotel)}>
                  View Deal <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HotelResults;
