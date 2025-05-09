
import React, { useState } from 'react';
import { CommunityEvent, EventLocation } from '@/types/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Users, Clock, Check, X, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mongoApiService } from '@/api/mongoApiService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { DbDocument } from '@/api/mongoDbService';

// Default empty event
const DEFAULT_EVENT: Omit<CommunityEvent, 'id' | 'createdAt' | '_id'> = {
  title: '',
  description: '',
  date: '',
  location: {
    type: 'online',
    details: '',
  },
  status: 'upcoming',
  attendees: [],
  organizer: {
    id: '1',  // This should be the current user's ID in a real app
    name: 'Current User',  // This should be the current user's name
  },
};

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CommunityEvent | null;
}

// Event creation/edit dialog component
const EventDialog: React.FC<EventDialogProps> = ({ open, onOpenChange, event }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Omit<CommunityEvent, 'id' | 'createdAt' | '_id'>>(
    event || DEFAULT_EVENT
  );
  
  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: Omit<CommunityEvent, 'id' | 'createdAt' | '_id'>) => {
      const result = await mongoApiService.insertDocument('communityEvents', {
        ...eventData,
        createdAt: new Date().toISOString(),
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityEvents'] });
      toast.success('Event created successfully!');
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    }
  });
  
  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, eventData }: { id: string, eventData: Partial<CommunityEvent> }) => {
      const result = await mongoApiService.updateDocument('communityEvents', id, eventData);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityEvents'] });
      toast.success('Event updated successfully!');
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error updating event:', error);
      toast.error('Failed to update event. Please try again.');
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationTypeChange = (value: 'online' | 'in-person') => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        type: value,
      },
    }));
  };

  const handleLocationDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        details: e.target.value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (event && (event._id || event.id)) {
      updateEventMutation.mutate({ 
        id: (event._id || event.id) as string, 
        eventData: formData 
      });
    } else {
      createEventMutation.mutate(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            Fill out the details below to {event ? 'update the' : 'create a new'} community event.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input 
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter event title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the event"
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="date">Event Date</Label>
            <Input 
              id="date"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label>Location Type</Label>
            <RadioGroup 
              value={formData.location.type} 
              onValueChange={(value) => handleLocationTypeChange(value as 'online' | 'in-person')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online">Online</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-person" id="in-person" />
                <Label htmlFor="in-person">In-person</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="locationDetails">
              {formData.location.type === 'online' ? 'Meeting Link' : 'Location Address'}
            </Label>
            <Input 
              id="locationDetails"
              name="locationDetails"
              value={formData.location.details}
              onChange={handleLocationDetailsChange}
              placeholder={formData.location.type === 'online' ? 'Enter meeting link' : 'Enter address'}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="status">Event Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: string) => {
                setFormData(prev => ({ ...prev, status: value as CommunityEvent['status'] }))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Event Card component
const EventCard: React.FC<{ event: CommunityEvent }> = ({ event }) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {event.image && (
        <div className="h-40 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(event.status)}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span>{event.location.type === 'online' ? 'Online Event' : event.location.details}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-primary" />
            <span>Organized by {event.organizer.name}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-primary" />
            <span>{Array.isArray(event.attendees) ? event.attendees.length : 0} attendees</span>
          </div>
        </div>
        
        <div className="pt-4 flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Check className="h-4 w-4 mr-1" /> Attend
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main CommunityEvents component
const CommunityEvents: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CommunityEvent | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Fetch events from the MongoDB service
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['communityEvents'],
    queryFn: async () => {
      try {
        const result = await mongoApiService.queryDocuments('communityEvents', {});
        // Convert DbDocument to CommunityEvent
        return result.map(doc => ({ ...doc } as CommunityEvent));
      } catch (error) {
        console.error('Error fetching events:', error);
        return [];
      }
    }
  });

  // Filter events based on the selected tab
  const filteredEvents = events.filter((event) => {
    if (activeTab === 'all') return true;
    return event.status === activeTab;
  });

  const handleCreateEvent = () => {
    setCurrentEvent(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Community Events</h2>
        <Button onClick={handleCreateEvent} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id || event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No events found</h3>
          <p className="mt-2 text-muted-foreground">
            {activeTab === 'all' 
              ? 'There are no community events yet.' 
              : `There are no ${activeTab} events at the moment.`
            }
          </p>
          <Button onClick={handleCreateEvent} className="mt-4">
            Create the first event
          </Button>
        </div>
      )}
      
      <EventDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        event={currentEvent} 
      />
    </div>
  );
};

export default CommunityEvents;
