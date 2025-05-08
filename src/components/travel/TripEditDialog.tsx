
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Trip } from '@/models/Trip';
import { useTrips } from '@/hooks/useTrips';
import { useSession } from '@/hooks/useSession';

interface TripEditDialogProps {
  open: boolean;
  onClose: () => void;
  trip: Trip | null;
}

// Define a schema for form validation that will handle type conversions
const tripFormSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  price: z.coerce.number().min(1, "Price must be a positive number"),
  guests: z.coerce.number().min(1, "Guests must be at least 1"),
  imageUrl: z.string().optional()
});

export function TripEditDialog({ open, onClose, trip }: TripEditDialogProps) {
  const { toast } = useToast();
  const { session } = useSession();
  const { updateTrip } = useTrips();
  const [formData, setFormData] = useState({
    destination: trip?.details.title || '',
    startDate: trip?.details.startDate ? new Date(trip.details.startDate).toISOString().split('T')[0] : '',
    endDate: trip?.details.endDate ? new Date(trip.details.endDate).toISOString().split('T')[0] : '',
    guests: trip?.details.guests || 1,
    price: trip?.details.price || 0,
    imageUrl: '',  // Changed from image to imageUrl
  });

  // Update form when trip changes
  useEffect(() => {
    if (trip) {
      setFormData({
        destination: trip.details.title || '',
        startDate: trip.details.startDate ? new Date(trip.details.startDate).toISOString().split('T')[0] : '',
        endDate: trip.details.endDate ? new Date(trip.details.endDate).toISOString().split('T')[0] : '',
        guests: trip.details.guests || 1,
        price: trip.details.price || 0,
        imageUrl: '', // Changed from image to imageUrl
      });
    }
  }, [trip]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Parse and validate the form data, this will also convert strings to numbers
      const validatedData = tripFormSchema.parse(formData);
      
      if (trip && trip._id && session.user?.id) {
        // Update the trip with validated data
        updateTrip({
          tripId: trip._id,
          updates: {
            title: validatedData.destination,
            destinationLocation: validatedData.destination,
            startDate: new Date(validatedData.startDate),
            endDate: new Date(validatedData.endDate),
            price: validatedData.price,
            guests: validatedData.guests,
            // Removed the image property as it doesn't exist in the Trip details type
          }
        });
        
        toast({
          title: 'Trip Updated',
          description: `Your trip to ${validatedData.destination} has been updated.`,
        });
        onClose();
      } else {
        throw new Error("Missing trip ID or user ID");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Display the first error message
        toast({
          title: 'Invalid Form Data',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        console.error('Error saving trip:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input 
              id="destination" 
              name="destination" 
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                id="startDate" 
                name="startDate" 
                type="date" 
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input 
                id="endDate" 
                name="endDate" 
                type="date" 
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Budget ($)</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                min="0" 
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">Guests</Label>
              <Input 
                id="guests" 
                name="guests" 
                type="number" 
                min="1" 
                value={formData.guests}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input 
              id="imageUrl" 
              name="imageUrl" 
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Update Trip</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
