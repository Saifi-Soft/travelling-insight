
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plane, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { flightApi } from '@/api/travelService';
import { useToast } from '@/hooks/use-toast';

interface FlightLocation {
  code: string;
  city: string;
  time: string;
}

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: FlightLocation;
  arrival: FlightLocation;
  duration: string;
  stops: number;
  stopLocation?: string;
  price: number;
  currency: string;
  affiliateUrl: string;
  originalUrl?: string;
}

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const query = new URLSearchParams(location.search);
  const departure = query.get('departure') || '';
  const destination = query.get('destination') || '';
  const departDate = query.get('departDate') || '';
  const returnDate = query.get('returnDate') || '';
  const passengers = query.get('passengers') || '1';

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Call our API service
        const result = await flightApi.searchFlights({
          departure,
          destination,
          departDate,
          returnDate,
          passengers: parseInt(passengers, 10)
        });
        
        setFlights(result.flights);
      } catch (error) {
        console.error("Error fetching flights:", error);
        setError('Failed to load flights. Please try again.');
        toast({
          title: "Error",
          description: "Failed to load flights. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [departure, destination, departDate, returnDate, passengers, toast]);

  const handleSelectFlight = (flight: Flight) => {
    // For direct booking through our platform, navigate to our booking page
    if (flight.originalUrl) {
      navigate(flight.originalUrl);
    } else {
      // For affiliate links, open in new tab
      window.open(flight.affiliateUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-0">
              <Skeleton className="h-6 w-1/3 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-10 w-1/4" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Skeleton className="h-6 w-1/5" />
              <Skeleton className="h-10 w-1/4" />
            </CardFooter>
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
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </Card>
    );
  }

  if (flights.length === 0) {
    return (
      <Card className="text-center p-8 mt-6">
        <h3 className="text-xl font-semibold mb-2">No Flights Found</h3>
        <p className="text-muted-foreground">
          We couldn't find any flights matching your search criteria. Please try different dates or locations.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 mt-6">
      {flights.map((flight) => (
        <Card key={flight.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{flight.airline} · {flight.flightNumber}</CardTitle>
              <Badge variant={flight.stops === 0 ? "outline" : "secondary"}>
                {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{flight.departure.time}</div>
                <div className="text-sm font-medium">{flight.departure.code}</div>
                <div className="text-xs text-muted-foreground">{flight.departure.city}</div>
              </div>
              
              <div className="flex-1 mx-4 px-6">
                <div className="relative">
                  <div className="border-t border-dashed border-gray-300 absolute w-full top-4"></div>
                  <div className="flex justify-between">
                    <Plane className="h-8 w-8 -rotate-90 bg-background z-10 p-1" />
                    <ArrowRight className="h-8 w-8 bg-background z-10 p-1" />
                  </div>
                </div>
                <div className="text-xs text-center flex items-center justify-center mt-1">
                  <Clock className="h-3 w-3 mr-1" /> {flight.duration}
                  {flight.stopLocation && (
                    <span className="ml-2">· via {flight.stopLocation}</span>
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">{flight.arrival.time}</div>
                <div className="text-sm font-medium">{flight.arrival.code}</div>
                <div className="text-xs text-muted-foreground">{flight.arrival.city}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t pt-4">
            <div>
              <span className="text-2xl font-bold">${flight.price}</span>
              <span className="text-sm text-muted-foreground ml-1">per person</span>
            </div>
            <Button onClick={() => handleSelectFlight(flight)}>
              Select Flight <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FlightResults;
