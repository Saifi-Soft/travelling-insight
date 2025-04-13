
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { communityApi } from '@/api/communityApiService';
import { Skeleton } from '@/components/ui/skeleton';
import { CommunityEvent } from '@/types/common';

const CommunityEvents = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['communityEvents'],
    queryFn: () => communityApi.events.getAll(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const upcomingEvents = events?.filter(event => 
    new Date(event.date) > new Date()
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <Button variant="outline">Create Event</Button>
      </div>

      {upcomingEvents.length === 0 ? (
        <Card className="text-center p-8">
          <div className="flex flex-col items-center gap-4">
            <Calendar className="h-12 w-12 text-gray-300" />
            <div>
              <h3 className="text-xl font-medium mb-2">No upcoming events</h3>
              <p className="text-gray-500">Be the first to create a travel event for the community!</p>
            </div>
            <Button>Create an Event</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

const EventCard = ({ event }: { event: CommunityEvent }) => {
  const eventDate = new Date(event.date);
  
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1">{event.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {formattedDate} at {formattedTime}
            </div>
          </div>
          <Badge 
            variant={
              event.status === 'upcoming' ? 'outline' : 
              event.status === 'ongoing' ? 'secondary' :
              'destructive'
            }
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{event.description}</p>
        
        <div className="flex flex-col space-y-3">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              {event.location.type === 'online' ? 'Online Event' : event.location.details}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              {event.attendees.length} {event.attendees.length === 1 ? 'attendee' : 'attendees'}
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm">View Details</Button>
          <Button size="sm">Attend</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityEvents;
