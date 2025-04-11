
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Languages, Clock, Calendar, CheckCircle, Filter, SlidersHorizontal } from 'lucide-react';

// Mock data that would come from affiliate API
const MOCK_GUIDES = [
  {
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
  {
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
  },
  {
    id: "guide-3",
    name: "Sophia Williams",
    location: "Rome, Italy",
    languages: ["English", "Italian", "French"],
    price: 82,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
    rating: 4.7,
    reviewCount: 113,
    specialties: ["Ancient History", "Art", "Local Cuisine"],
    availability: ["Monday", "Wednesday", "Thursday", "Saturday", "Sunday"]
  },
  {
    id: "guide-4",
    name: "Ahmed Hassan",
    location: "Cairo, Egypt",
    languages: ["English", "Arabic"],
    price: 65,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 4.9,
    reviewCount: 78,
    specialties: ["Archaeology", "Pyramids", "Egyptian History"],
    availability: ["Tuesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
];

const TourGuideResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState<any[]>([]);
  
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, this would be an API call to the affiliate
        // with the search parameters
        console.log('Searching for guides in:', destination);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Filter guides based on destination (in a real app this would be done by the API)
        const filteredGuides = destination 
          ? MOCK_GUIDES.filter(guide => 
              guide.location.toLowerCase().includes(destination.toLowerCase()))
          : MOCK_GUIDES;
        
        setGuides(filteredGuides);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching guides:", error);
        setLoading(false);
        setGuides([]);
      }
    };
    
    fetchData();
  }, [destination]);
  
  const handleBookGuide = (guideId: string) => {
    // In a real application, this would navigate to a booking page with the guide ID
    navigate(`/travel/booking/guide/${guideId}`);
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <Skeleton className="h-48 md:h-auto md:w-1/4" />
                  <div className="p-6 flex-1">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-1">
            {guides.length} Tour Guides {destination ? `in ${destination}` : 'Available'}
          </h2>
          {date && (
            <p className="text-muted-foreground text-sm flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> Available on {date}
            </p>
          )}
        </div>
        
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="h-4 w-4 mr-2" /> 
          Filter Results
        </Button>
      </div>
      
      <div className="space-y-6">
        {guides.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-center space-y-4">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No Guides Found</h3>
                <p className="text-muted-foreground">
                  We couldn't find any tour guides matching your criteria.
                  Try adjusting your search parameters or exploring a different location.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/travel')}
                className="mt-4"
              >
                Search Again
              </Button>
            </div>
          </Card>
        ) : (
          guides.map((guide) => (
            <Card key={guide.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4">
                    <img 
                      src={guide.image} 
                      alt={guide.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="mb-4">
                      <div className="flex justify-between">
                        <h3 className="text-xl font-bold">{guide.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 font-semibold">{guide.rating}</span>
                          <span className="text-sm text-muted-foreground ml-1">
                            ({guide.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-1 text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{guide.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {guide.specialties.map((specialty: string) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center mb-4 text-sm text-muted-foreground">
                      <Languages className="h-4 w-4 mr-2" />
                      <span>Speaks: {guide.languages.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-center mb-4 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Available: {guide.availability.join(', ')}</span>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4">
                      <div className="text-2xl font-bold">
                        ${guide.price} <span className="text-sm font-normal text-muted-foreground">per hour</span>
                      </div>
                      <Button onClick={() => handleBookGuide(guide.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Book Guide
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TourGuideResults;
