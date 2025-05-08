
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, Users, MapPin, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TravelSearchProps {
  type: 'hotels' | 'flights' | 'guides';
}

// Mock locations data (fallback if API fails)
const MOCK_LOCATIONS = [
  { id: "1", name: "Dubai, United Arab Emirates" },
  { id: "2", name: "New York, United States" },
  { id: "3", name: "London, United Kingdom" },
  { id: "4", name: "Tokyo, Japan" },
  { id: "5", name: "Paris, France" },
  { id: "6", name: "Rome, Italy" },
  { id: "7", name: "Sydney, Australia" },
  { id: "8", name: "Barcelona, Spain" },
  { id: "9", name: "Amsterdam, Netherlands" },
  { id: "10", name: "Cairo, Egypt" },
];

const TravelSearch = ({ type }: TravelSearchProps) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [passengers, setPassengers] = useState(1);
  const [departure, setDeparture] = useState('');
  
  // Location search states
  const [destinationOptions, setDestinationOptions] = useState<{id: string, name: string}[]>([]);
  const [departureOptions, setDepartureOptions] = useState<{id: string, name: string}[]>([]);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(false);
  const [isLoadingDepartures, setIsLoadingDepartures] = useState(false);

  // Function to search for locations
  const searchLocations = async (query: string, isDestination = true) => {
    if (!query || query.length < 2) {
      return isDestination ? setDestinationOptions([]) : setDepartureOptions([]);
    }

    isDestination ? setIsLoadingDestinations(true) : setIsLoadingDepartures(true);

    try {
      // Try to fetch from MongoDB API
      const response = await fetch(`/api/locations?query=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        isDestination ? setDestinationOptions(data) : setDepartureOptions(data);
      } else {
        // Fallback to mock data if API fails
        const filteredLocations = MOCK_LOCATIONS.filter(location => 
          location.name.toLowerCase().includes(query.toLowerCase())
        );
        isDestination ? setDestinationOptions(filteredLocations) : setDepartureOptions(filteredLocations);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      // Fallback to mock data
      const filteredLocations = MOCK_LOCATIONS.filter(location => 
        location.name.toLowerCase().includes(query.toLowerCase())
      );
      isDestination ? setDestinationOptions(filteredLocations) : setDepartureOptions(filteredLocations);
    } finally {
      isDestination ? setIsLoadingDestinations(false) : setIsLoadingDepartures(false);
    }
  };

  // Debounced search for locations
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocations(destination);
    }, 300);

    return () => clearTimeout(timer);
  }, [destination]);

  useEffect(() => {
    if (type === 'flights') {
      const timer = setTimeout(() => {
        searchLocations(departure, false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [departure, type]);

  const handleSearch = () => {
    // Create query parameters for the search
    const params = new URLSearchParams();
    params.append('destination', destination);
    
    if (type === 'hotels') {
      params.append('checkIn', date ? format(date, 'yyyy-MM-dd') : '');
      params.append('checkOut', endDate ? format(endDate, 'yyyy-MM-dd') : '');
      params.append('guests', passengers.toString());
      
      // Navigate to results page with search parameters
      navigate(`/travel/hotels?${params.toString()}`);
    } else if (type === 'flights') {
      params.append('departure', departure);
      params.append('departDate', date ? format(date, 'yyyy-MM-dd') : '');
      params.append('returnDate', endDate ? format(endDate, 'yyyy-MM-dd') : '');
      params.append('passengers', passengers.toString());
      
      // Navigate to results page with search parameters
      navigate(`/travel/flights?${params.toString()}`);
    } else if (type === 'guides') {
      params.append('date', date ? format(date, 'yyyy-MM-dd') : '');
      params.append('people', passengers.toString());
      
      // Navigate to results page with search parameters
      navigate(`/travel/guides?${params.toString()}`);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="grid gap-4">
          {type === 'hotels' && (
            <div className="grid gap-4">
              <div>
                <label htmlFor="destination" className="block text-sm font-medium mb-1">
                  Destination
                </label>
                <Popover open={isDestinationOpen} onOpenChange={setIsDestinationOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="destination"
                        placeholder="City, region, or specific hotel"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        onFocus={() => setIsDestinationOpen(true)}
                        className="pl-10 w-full"
                      />
                      {destination && (
                        <button 
                          onClick={() => {
                            setDestination('');
                            setDestinationOptions([]);
                          }}
                          className="absolute right-3 top-3"
                          type="button"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[300px] md:w-[400px]" align="start">
                    <Command>
                      <CommandInput placeholder="Search destinations..." />
                      <CommandList>
                        <CommandEmpty>
                          {isLoadingDestinations ? (
                            <div className="flex items-center justify-center p-4 text-sm">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Searching locations...
                            </div>
                          ) : (
                            "No locations found"
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {destinationOptions.map((option) => (
                            <CommandItem
                              key={option.id}
                              onSelect={() => {
                                setDestination(option.name);
                                setIsDestinationOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              {option.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          
          {type === 'flights' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="departure" className="block text-sm font-medium mb-1">
                  Departure
                </label>
                <Popover open={isDepartureOpen} onOpenChange={setIsDepartureOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="departure"
                        placeholder="City or airport"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        onFocus={() => setIsDepartureOpen(true)}
                        className="pl-10 w-full"
                      />
                      {departure && (
                        <button 
                          onClick={() => {
                            setDeparture('');
                            setDepartureOptions([]);
                          }}
                          className="absolute right-3 top-3"
                          type="button"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[300px] md:w-[400px]" align="start">
                    <Command>
                      <CommandInput placeholder="Search departure locations..." />
                      <CommandList>
                        <CommandEmpty>
                          {isLoadingDepartures ? (
                            <div className="flex items-center justify-center p-4 text-sm">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Searching locations...
                            </div>
                          ) : (
                            "No locations found"
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {departureOptions.map((option) => (
                            <CommandItem
                              key={option.id}
                              onSelect={() => {
                                setDeparture(option.name);
                                setIsDepartureOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              {option.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label htmlFor="destination" className="block text-sm font-medium mb-1">
                  Destination
                </label>
                <Popover open={isDestinationOpen} onOpenChange={setIsDestinationOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="destination"
                        placeholder="City or airport"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        onFocus={() => setIsDestinationOpen(true)}
                        className="pl-10 w-full"
                      />
                      {destination && (
                        <button 
                          onClick={() => {
                            setDestination('');
                            setDestinationOptions([]);
                          }}
                          className="absolute right-3 top-3"
                          type="button"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[300px] md:w-[400px]" align="start">
                    <Command>
                      <CommandInput placeholder="Search destinations..." />
                      <CommandList>
                        <CommandEmpty>
                          {isLoadingDestinations ? (
                            <div className="flex items-center justify-center p-4 text-sm">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Searching locations...
                            </div>
                          ) : (
                            "No locations found"
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {destinationOptions.map((option) => (
                            <CommandItem
                              key={option.id}
                              onSelect={() => {
                                setDestination(option.name);
                                setIsDestinationOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              {option.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          
          {type === 'guides' && (
            <div className="grid gap-4">
              <div>
                <label htmlFor="destination" className="block text-sm font-medium mb-1">
                  Destination
                </label>
                <Popover open={isDestinationOpen} onOpenChange={setIsDestinationOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="destination"
                        placeholder="Where do you need a guide?"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        onFocus={() => setIsDestinationOpen(true)}
                        className="pl-10 w-full"
                      />
                      {destination && (
                        <button 
                          onClick={() => {
                            setDestination('');
                            setDestinationOptions([]);
                          }}
                          className="absolute right-3 top-3"
                          type="button"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[300px] md:w-[400px]" align="start">
                    <Command>
                      <CommandInput placeholder="Search destinations..." />
                      <CommandList>
                        <CommandEmpty>
                          {isLoadingDestinations ? (
                            <div className="flex items-center justify-center p-4 text-sm">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Searching locations...
                            </div>
                          ) : (
                            "No locations found"
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {destinationOptions.map((option) => (
                            <CommandItem
                              key={option.id}
                              onSelect={() => {
                                setDestination(option.name);
                                setIsDestinationOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              {option.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {type === 'hotels' ? 'Check In' : type === 'flights' ? 'Departure Date' : 'Tour Date'}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {type !== 'guides' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {type === 'hotels' ? 'Check Out' : 'Return Date'}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => 
                        date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                        (!!date && date < date)
                      }
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {type === 'hotels' ? 'Guests' : type === 'flights' ? 'Passengers' : 'People'}
              </label>
              <div className="flex">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPassengers((prev) => (prev > 1 ? prev - 1 : 1))}
                  disabled={passengers <= 1}
                  className="rounded-r-none"
                  type="button"
                >
                  -
                </Button>
                <div className="flex items-center justify-center border-y px-4 h-10">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{passengers}</span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPassengers((prev) => prev + 1)}
                  className="rounded-l-none"
                  type="button"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          
          <Button className="w-full mt-4" onClick={handleSearch} type="button">
            <Search className="mr-2 h-5 w-5" />
            {type === 'hotels' 
              ? 'Search Hotels' 
              : type === 'flights' 
              ? 'Search Flights' 
              : 'Find Tour Guides'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelSearch;
