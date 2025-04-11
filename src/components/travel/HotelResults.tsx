
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MapPin, Check } from 'lucide-react';

// Mock hotel data (in a real app, this would come from the affiliate API)
const MOCK_HOTELS = [
  {
    id: "hotel-1",
    name: "Grand Plaza Hotel",
    location: "Downtown Dubai",
    price: 199,
    currency: "USD",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDI%3D&auto=format&fit=crop&w=800&q=60",
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
    affiliateUrl: "/travel/booking/hotel-1"
  },
  {
    id: "hotel-2",
    name: "Ocean View Resort",
    location: "Palm Jumeirah",
    price: 299,
    currency: "USD",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsfGVufDB8fDB8fHwy&auto=format&fit=crop&w=800&q=60",
    amenities: ["Beach Access", "Free WiFi", "Pool", "Gym"],
    affiliateUrl: "/travel/booking/hotel-2"
  },
  {
    id: "hotel-3",
    name: "Desert Oasis Inn",
    location: "Al Qudra",
    price: 159,
    currency: "USD",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWx8ZW58MHx8MHx8fDI%3D&auto=format&fit=crop&w=800&q=60",
    amenities: ["Desert View", "Free WiFi", "Pool"],
    affiliateUrl: "/travel/booking/hotel-3"
  }
];

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
}

const HotelResults = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const query = new URLSearchParams(location.search);
  const destination = query.get('destination') || '';
  const checkIn = query.get('checkIn') || '';
  const checkOut = query.get('checkOut') || '';
  const guests = query.get('guests') || '1';

  useEffect(() => {
    // Simulate API call to affiliate partner
    const fetchHotels = async () => {
      try {
        // In a real app, this would be an API call to the affiliate partner
        // with proper tracking IDs and parameters
        console.log("Fetching hotels for:", { destination, checkIn, checkOut, guests });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Filter hotels based on destination (simple mock)
        const filteredHotels = MOCK_HOTELS.filter(
          hotel => hotel.location.toLowerCase().includes(destination.toLowerCase())
        );
        
        setHotels(filteredHotels.length > 0 ? filteredHotels : MOCK_HOTELS);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setHotels([]);
        setLoading(false);
      }
    };

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
                  {hotel.amenities.map((amenity, index) => (
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
                <Button asChild>
                  <a href={hotel.affiliateUrl}>View Deal</a>
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
