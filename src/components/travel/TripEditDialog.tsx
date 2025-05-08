
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  guests: number;
  price: number;
  image?: string;
}

interface TripEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  trip?: Trip | null;
  onSave: (trip: Trip) => void;
}

const tripSchema = z.object({
  id: z.string(),
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  price: z.coerce.number().min(1, "Price must be a positive number"),
  guests: z.coerce.number().min(1, "Guests must be at least 1"),
  image: z.string().optional()
});

export const TripEditDialog: React.FC<TripEditDialogProps> = ({ isOpen, onClose, trip, onSave }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Trip>(
    trip || {
      id: Math.random().toString(36).substr(2, 9),
      destination: '',
      startDate: '',
      endDate: '',
      guests: 1,
      price: 0,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Parse and validate the form data, this will also convert strings to numbers for price and guests
      const validatedTrip = tripSchema.parse(formData);
      
      // Save the validated trip data
      onSave(validatedTrip);
      toast({
        title: trip ? 'Trip Updated' : 'Trip Created',
        description: `Your trip to ${validatedTrip.destination} has been ${trip ? 'updated' : 'created'}.`,
      });
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{trip ? 'Edit Trip' : 'Add New Trip'}</DialogTitle>
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
            <Label htmlFor="image">Image URL (optional)</Label>
            <Input 
              id="image" 
              name="image" 
              value={formData.image || ''}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{trip ? 'Update Trip' : 'Create Trip'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
