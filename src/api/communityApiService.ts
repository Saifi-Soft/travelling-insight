
// API service for community-related operations
import { mongoApiService } from './mongoApiService';

export const communityApi = {
  events: {
    getAll: async () => {
      try {
        // Initial demo data for community events
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
        
        // Store demo events if not exist
        const existingEvents = await mongoApiService.queryDocuments('communityEvents', {});
        if (existingEvents.length === 0) {
          for (const event of demoEvents) {
            await mongoApiService.insertDocument('communityEvents', event);
          }
          return demoEvents;
        }
        
        return existingEvents;
      } catch (error) {
        console.error('Error fetching community events:', error);
        return [];
      }
    },
    
    createEvent: async (eventData: any) => {
      try {
        return await mongoApiService.insertDocument('communityEvents', eventData);
      } catch (error) {
        console.error('Error creating community event:', error);
        throw error;
      }
    },
    
    attendEvent: async (eventId: string, attendee: { id: string, name: string }) => {
      try {
        const event = await mongoApiService.getDocumentById('communityEvents', eventId);
        if (!event) throw new Error('Event not found');
        
        const attendees = event.attendees || [];
        const alreadyAttending = attendees.some((a: any) => a.id === attendee.id);
        
        if (alreadyAttending) return event;
        
        const updatedAttendees = [...attendees, attendee];
        return await mongoApiService.updateDocument('communityEvents', eventId, {
          attendees: updatedAttendees
        });
      } catch (error) {
        console.error('Error attending event:', error);
        throw error;
      }
    }
  }
};
