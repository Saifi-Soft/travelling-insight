
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Search, Users, MapPin, HelpingHand } from 'lucide-react';

interface TravelSearchProps {
  type: 'hotels' | 'flights' | 'guides';
}

const TravelSearch = ({ type }: TravelSearchProps) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [passengers, setPassengers] = useState(1);
  const [departure, setDeparture] = useState('');

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
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="destination"
                    placeholder="City, region, or specific hotel"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
            </div>
          )}
          
          {type === 'flights' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="departure" className="block text-sm font-medium mb-1">
                  Departure
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="departure"
                    placeholder="City or airport"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="destination" className="block text-sm font-medium mb-1">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="destination"
                    placeholder="City or airport"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
            </div>
          )}
          
          {type === 'guides' && (
            <div className="grid gap-4">
              <div>
                <label htmlFor="destination" className="block text-sm font-medium mb-1">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="destination"
                    placeholder="Where do you need a guide?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
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
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
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
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => !date || date <= date}
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
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          
          <Button className="w-full mt-4" onClick={handleSearch}>
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
