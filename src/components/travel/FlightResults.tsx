
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plane, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

// Mock flight data (in a real app, this would come from the affiliate API)
const MOCK_FLIGHTS = [
  {
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
    duration: "7h 30m",
    stops: 0,
    price: 850,
    currency: "USD",
    affiliateUrl: "/travel/booking/flight-1"
  },
  {
    id: "flight-2",
    airline: "British Airways",
    flightNumber: "BA106",
    departure: {
      code: "DXB",
      city: "Dubai",
      time: "10:20"
    },
    arrival: {
      code: "LHR",
      city: "London",
      time: "14:55"
    },
    duration: "7h 35m",
    stops: 0,
    price: 795,
    currency: "USD",
    affiliateUrl: "/travel/booking/flight-2"
  },
  {
    id: "flight-3",
    airline: "Qatar Airways",
    flightNumber: "QR009",
    departure: {
      code: "DXB",
      city: "Dubai",
      time: "09:15"
    },
    arrival: {
      code: "LHR",
      city: "London",
      time: "15:45"
    },
    duration: "9h 30m",
    stops: 1,
    stopLocation: "Doha (DOH)",
    price: 720,
    currency: "USD",
    affiliateUrl: "/travel/booking/flight-3"
  }
];

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
}

const FlightResults = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const query = new URLSearchParams(location.search);
  const departure = query.get('departure') || '';
  const destination = query.get('destination') || '';
  const departDate = query.get('departDate') || '';
  const returnDate = query.get('returnDate') || '';
  const passengers = query.get('passengers') || '1';

  useEffect(() => {
    // Simulate API call to affiliate partner
    const fetchFlights = async () => {
      try {
        // In a real app, this would be an API call to the affiliate partner
        console.log("Fetching flights for:", { 
          departure, destination, departDate, returnDate, passengers 
        });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Filter flights based on search (simple mock)
        let filteredFlights = [...MOCK_FLIGHTS];
        if (destination.toLowerCase().includes('london')) {
          setFlights(filteredFlights);
        } else {
          // If no matching destination, return empty for demo
          setFlights([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flights:", error);
        setFlights([]);
        setLoading(false);
      }
    };

    fetchFlights();
  }, [departure, destination, departDate, returnDate, passengers]);

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
            <Button asChild>
              <a href={flight.affiliateUrl}>Select Flight</a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FlightResults;
