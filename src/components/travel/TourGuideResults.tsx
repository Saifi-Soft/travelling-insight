
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Languages, Clock, Calendar, CheckCircle, ExternalLink, SlidersHorizontal } from 'lucide-react';
import { guideApi } from '@/api/travelService';
import { useToast } from '@/hooks/use-toast';

interface Guide {
  id: string;
  name: string;
  location: string;
  languages: string[];
  price: number;
  currency: string;
  image: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  availability: string[];
  affiliateUrl: string;
  originalUrl?: string;
}

const TourGuideResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';
  const people = searchParams.get('people') || '1';
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Call our API service
        const result = await guideApi.searchGuides({
          destination,
          date,
          people: parseInt(people, 10)
        });
        
        setGuides(result.guides);
      } catch (error) {
        console.error("Error fetching guides:", error);
        setError('Failed to load tour guides. Please try again.');
        toast({
          title: "Error",
          description: "Failed to load tour guides. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [destination, date, people, toast]);
  
  const handleBookGuide = (guide: Guide) => {
    // For direct booking through our platform, navigate to our booking page
    if (guide.originalUrl) {
      navigate(guide.originalUrl);
    } else {
      // For affiliate links, open in new tab with tracking parameters
      window.open(guide.affiliateUrl, '_blank');
    }
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

  if (error) {
    return (
      <Card className="text-center p-8 mt-6">
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </Card>
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
                      <Button onClick={() => handleBookGuide(guide)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Book Guide <ExternalLink className="ml-2 h-4 w-4" />
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
