
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrips } from '@/hooks/useTrips';
import { Trip } from '@/models/Trip';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Separator } from '@/components/ui/separator';

interface TripEditDialogProps {
  trip: Trip;
  open: boolean;
  onClose: () => void;
}

const TripEditDialog: React.FC<TripEditDialogProps> = ({ trip, open, onClose }) => {
  const { updateTrip } = useTrips();
  const [startDate, setStartDate] = useState<Date | undefined>(
    trip.details.startDate ? new Date(trip.details.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    trip.details.endDate ? new Date(trip.details.endDate) : undefined
  );
  
  const viewOnly = trip.status === 'cancelled' || trip.status === 'completed';
  const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    destinationLocation: z.string().min(2, "Destination is required"),
    price: z.string().optional().refine(val => !val || !isNaN(Number(val)), {
      message: "Price must be a valid number"
    }).transform(val => val ? Number(val) : undefined),
    guests: z.string().optional().refine(val => !val || !isNaN(Number(val)), {
      message: "Guests must be a valid number"
    }).transform(val => val ? Number(val) : undefined)
  });
  
  // Create a type for the form values that matches the schema
  type FormValues = z.infer<typeof formSchema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: trip.details.title,
      destinationLocation: trip.details.destinationLocation,
      price: trip.details.price?.toString() || '',
      guests: trip.details.guests?.toString() || ''
    }
  });
  
  const onSubmit = (values: FormValues) => {
    if (viewOnly) {
      onClose();
      return;
    }
    
    // Parse and transform the values through the Zod schema
    const processedValues = formSchema.parse(values);
    
    // Create updates object with properly typed values
    const updates = {
      title: processedValues.title,
      destinationLocation: processedValues.destinationLocation,
      price: processedValues.price,
      guests: processedValues.guests,
      startDate: startDate || new Date(),
      endDate,
    };
    
    updateTrip({
      tripId: trip._id!,
      updates
    });
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {viewOnly ? 'Trip Details' : 'Edit Trip'}
            {trip.status === 'cancelled' && <Badge variant="destructive" className="ml-2">Cancelled</Badge>}
            {trip.status === 'completed' && <Badge variant="secondary" className="ml-2">Completed</Badge>}
          </DialogTitle>
          <DialogDescription>
            {viewOnly 
              ? 'View your trip details below.'
              : `Edit your ${trip.type} trip details. This will count as one of your 3 free edits.`
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trip Title</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={viewOnly} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="destinationLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={viewOnly} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                      disabled={viewOnly}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                      disabled={viewOnly}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => !startDate || date < startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ({trip.details.currency || 'USD'})</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={viewOnly} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="1" disabled={viewOnly} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Display type-specific fields */}
            {trip.type === 'hotel' && trip.details.hotelName && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Hotel Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hotel Name</Label>
                      <Input value={trip.details.hotelName} disabled />
                    </div>
                    {trip.details.roomType && (
                      <div className="space-y-2">
                        <Label>Room Type</Label>
                        <Input value={trip.details.roomType} disabled />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {trip.type === 'flight' && trip.details.airline && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Flight Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Airline</Label>
                      <Input value={trip.details.airline} disabled />
                    </div>
                    {trip.details.flightNumber && (
                      <div className="space-y-2">
                        <Label>Flight Number</Label>
                        <Input value={trip.details.flightNumber} disabled />
                      </div>
                    )}
                  </div>
                  
                  {(trip.details.departureLocation || trip.details.departureTime) && (
                    <div className="grid grid-cols-2 gap-4">
                      {trip.details.departureLocation && (
                        <div className="space-y-2">
                          <Label>From</Label>
                          <Input value={trip.details.departureLocation} disabled />
                        </div>
                      )}
                      {trip.details.departureTime && (
                        <div className="space-y-2">
                          <Label>Departure Time</Label>
                          <Input value={trip.details.departureTime} disabled />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
            
            {trip.type === 'guide' && trip.details.guideName && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium">Guide Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Guide Name</Label>
                      <Input value={trip.details.guideName} disabled />
                    </div>
                    {trip.details.tourType && (
                      <div className="space-y-2">
                        <Label>Tour Type</Label>
                        <Input value={trip.details.tourType} disabled />
                      </div>
                    )}
                  </div>
                  
                  {trip.details.duration && (
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input value={trip.details.duration} disabled />
                    </div>
                  )}
                </div>
              </>
            )}
            
            {!viewOnly && trip.editCount >= 2 && (
              <FormDescription className="text-amber-600">
                This is edit {trip.editCount + 1}/3 for your free account.
              </FormDescription>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {viewOnly ? 'Close' : 'Cancel'}
              </Button>
              <Button type="submit">
                {viewOnly ? (
                  'Close'
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TripEditDialog;
