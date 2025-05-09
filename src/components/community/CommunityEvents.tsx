
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { communityApi } from '@/api/communityApiService';
import { Skeleton } from '@/components/ui/skeleton';
import { CommunityEvent } from '@/types/common';
import { mongoApiService } from '@/api/mongoApiService';
import { toast } from 'sonner';
import { DbDocument } from '@/api/mongoDbService';

const CommunityEvents = () => {
  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ['communityEvents'],
    queryFn: async () => {
      try {
        const mongoEvents = await mongoApiService.queryDocuments('communityEvents', {});
        
        if (mongoEvents && mongoEvents.length > 0) {
          console.log("Found events in MongoDB:", mongoEvents);
          return mongoEvents as CommunityEvent[];
        }
        
        console.log("No events in MongoDB, using API service");
        return await communityApi.events.getAll();
      } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
      }
    },
  });

  useEffect(() => {
    const createDemoEvents = async () => {
      try {
        const existingEvents = await mongoApiService.queryDocuments('communityEvents', {});
        
        if (!existingEvents || existingEvents.length === 0) {
          console.log("No events found in MongoDB, creating demo events");
          
          const demoEvents = [
            {
              title: "Annual Backpackers Meetup",
              description: "Join fellow backpackers for our annual gathering to share stories, tips, and make plans for future adventures.",
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              location: { type: "in-person", details: "Central Park, New York City" },
              status: "upcoming",
              attendees: [
                { id: "user1", name: "Alex Johnson" },
                { id: "user2", name: "Sam Peterson" }
              ],
              organizer: { id: "admin1", name: "Travel Community Admin" },
              createdAt: new Date().toISOString()
            },
            {
              title: "Virtual Travel Photography Workshop",
              description: "Learn travel photography techniques from professional photographers in this interactive online workshop.",
              date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              location: { type: "online", details: "Zoom Meeting" },
              status: "upcoming",
              attendees: [
                { id: "user3", name: "Jamie Smith" },
                { id: "user4", name: "Robin Williams" },
                { id: "user5", name: "Taylor Johnson" }
              ],
              organizer: { id: "photo1", name: "PhotoTravelPro" },
              createdAt: new Date().toISOString()
            },
            {
              title: "Southeast Asia Travel Planning Session",
              description: "Group session for travelers planning trips to Southeast Asia in the coming year. Share itineraries and connect with other travelers.",
              date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              location: { type: "online", details: "Google Meet" },
              status: "upcoming",
              attendees: [
                { id: "user6", name: "Jordan Lee" }
              ],
              organizer: { id: "user7", name: "Asia Travel Expert" },
              createdAt: new Date().toISOString()
            }
          ];
          
          for (const event of demoEvents) {
            await mongoApiService.insertDocument('communityEvents', event);
          }
          
          console.log("Created demo events in MongoDB");
          refetch();
        }
      } catch (error) {
        console.error("Error creating demo events:", error);
      }
    };
    
    createDemoEvents();
  }, [refetch]);

  const handleCreateEvent = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName') || 'Community Member';
      
      if (!userId) {
        toast.error("You need to be logged in to create an event");
        return;
      }
      
      const newEvent = {
        title: "Community Meetup: " + new Date().toLocaleDateString(),
        description: "Join us for a community meetup to discuss travel plans and share experiences.",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        location: { type: "online", details: "Zoom Meeting (link will be shared)" },
        status: "upcoming",
        attendees: [{ id: userId, name: userName }],
        organizer: { id: userId, name: userName },
        createdAt: new Date().toISOString()
      };
      
      await mongoApiService.insertDocument('communityEvents', newEvent);
      toast.success("Event created successfully!");
      refetch();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-lg">
        <h3 className="font-bold">Error loading events</h3>
        <p>There was a problem loading community events. Please try again later.</p>
        <Button onClick={() => refetch()} className="mt-2">Retry</Button>
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
        <Button variant="outline" onClick={handleCreateEvent}>Create Event</Button>
      </div>

      {upcomingEvents.length === 0 ? (
        <Card className="text-center p-8">
          <div className="flex flex-col items-center gap-4">
            <Calendar className="h-12 w-12 text-gray-300" />
            <div>
              <h3 className="text-xl font-medium mb-2">No upcoming events</h3>
              <p className="text-gray-500">Be the first to create a travel event for the community!</p>
            </div>
            <Button onClick={handleCreateEvent}>Create an Event</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents.map((event, index) => (
            <EventCard key={event._id || event.id || index} event={event as CommunityEvent} />
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

  const handleAttend = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName') || 'Community Member';
      
      if (!userId) {
        toast.error("You need to be logged in to attend events");
        return;
      }
      
      const isAttending = event.attendees?.some(attendee => {
        if (typeof attendee === 'string') {
          return attendee === userId;
        }
        return attendee.id === userId;
      });
      
      if (isAttending) {
        toast.info("You're already attending this event");
        return;
      }
      
      const updatedAttendees = [...(event.attendees || []), { id: userId, name: userName }];
      
      // Use either _id or id property, whichever is available
      const eventId = event._id || event.id;
      
      if (eventId) {
        await mongoApiService.updateDocument('communityEvents', eventId, {
          attendees: updatedAttendees
        });
        toast.success("You're now attending this event!");
      }
    } catch (error) {
      console.error("Error attending event:", error);
      toast.error("Failed to attend event. Please try again.");
    }
  };

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
              {event.attendees?.length || 0} {(event.attendees?.length || 0) === 1 ? 'attendee' : 'attendees'}
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm">View Details</Button>
          <Button size="sm" onClick={handleAttend}>Attend</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityEvents;
