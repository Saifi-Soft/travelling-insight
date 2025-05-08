
// This file handles all API calls to travel partners and affiliate networks
import { mongoApiService } from '@/api/mongoApiService';

// API configurations - in a real app, these should be environment variables
const SKYSCANNER_API_KEY = 'sk-test-api-key';
const BOOKING_PARTNER_ID = 'booking-test-partner';
const TRIPADVISOR_AFFILIATE_ID = 'tripadvisor-test-affiliate';

// Hotel API integration with MongoDB and Booking.com
const hotelApi = {
  searchHotels: async (params: {
    destination: string,
    checkIn: string,
    checkOut: string,
    guests: number
  }) => {
    try {
      console.log('Searching hotels with params:', params);
      
      // First try to fetch from MongoDB
      let hotels = [];
      try {
        // Query for hotels matching the destination (case-insensitive)
        const query = params.destination ? 
          { location: { $regex: params.destination, $options: 'i' } } : 
          {};
          
        hotels = await mongoApiService.queryDocuments('hotels', query);
        
        // If we have hotels in MongoDB, return them
        if (hotels && hotels.length > 0) {
          console.log('Found hotels in MongoDB:', hotels.length);
          return { hotels };
        }
      } catch (mongoError) {
        console.error('Error fetching from MongoDB:', mongoError);
        // Continue to fallback data if MongoDB fails
      }
      
      // Fallback to mock data if no MongoDB results
      const mockHotels = [
        {
          id: "hotel-1",
          name: "Grand Plaza Hotel",
          location: params.destination || "Popular Destination",
          price: 199,
          currency: "USD",
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDI%3D&auto=format&fit=crop&w=800&q=60",
          amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
          affiliateUrl: `https://www.booking.com/hotel/us/grand-plaza.html?aid=${BOOKING_PARTNER_ID}`,
          originalUrl: "/travel/booking/hotel/hotel-1"
        },
        {
          id: "hotel-2",
          name: "Ocean View Resort",
          location: params.destination || "Popular Destination",
          price: 299,
          currency: "USD",
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsfGVufDB8fDB8fHwy&auto=format&fit=crop&w=800&q=60",
          amenities: ["Beach Access", "Free WiFi", "Pool", "Gym"],
          affiliateUrl: `https://www.booking.com/hotel/us/ocean-view-resort.html?aid=${BOOKING_PARTNER_ID}`,
          originalUrl: "/travel/booking/hotel/hotel-2"
        }
      ];
      
      // Store mock data in MongoDB for future use if we don't have data
      if (hotels.length === 0) {
        try {
          for (const hotel of mockHotels) {
            await mongoApiService.insertDocument('hotels', hotel);
          }
          console.log('Stored mock hotels in MongoDB');
        } catch (insertError) {
          console.error('Error inserting mock hotels to MongoDB:', insertError);
        }
      }
      
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { hotels: mockHotels };
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw new Error('Failed to fetch hotels. Please try again.');
    }
  },
  
  // Get hotel details with affiliate link
  getHotelDetails: async (id: string) => {
    try {
      console.log('Fetching hotel details for:', id);
      
      // First try to fetch from MongoDB
      try {
        const hotel = await mongoApiService.queryDocuments('hotels', { id: id });
        if (hotel && hotel.length > 0) {
          return { hotel: hotel[0] };
        }
      } catch (mongoError) {
        console.error('Error fetching hotel from MongoDB:', mongoError);
        // Continue to fallback data if MongoDB fails
      }
      
      // Mock data for development (fallback)
      const hotel = {
        id,
        name: id === "hotel-1" ? "Grand Plaza Hotel" : "Ocean View Resort",
        location: "New York",
        price: id === "hotel-1" ? 199 : 299,
        currency: "USD",
        rating: id === "hotel-1" ? 4.8 : 4.9,
        image: id === "hotel-1" 
          ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDI%3D&auto=format&fit=crop&w=800&q=60"
          : "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsfGVufDB8fDB8fHwy&auto=format&fit=crop&w=800&q=60",
        amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
        affiliateUrl: `https://www.booking.com/hotel/us/${id}.html?aid=${BOOKING_PARTNER_ID}`
      };
      
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return { hotel };
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      throw new Error('Failed to fetch hotel details. Please try again.');
    }
  }
};

// Flight API integration with MongoDB and Skyscanner
const flightApi = {
  searchFlights: async (params: {
    departure: string,
    destination: string,
    departDate: string,
    returnDate: string,
    passengers: number
  }) => {
    try {
      console.log('Searching flights with params:', params);
      
      // First try to fetch from MongoDB
      let flights = [];
      try {
        // Create a query based on departure and destination
        const query = {};
        if (params.departure) {
          query['departure.code'] = { $regex: params.departure, $options: 'i' };
        }
        if (params.destination) {
          query['arrival.code'] = { $regex: params.destination, $options: 'i' };
        }
        
        flights = await mongoApiService.queryDocuments('flights', query);
        
        // If we have flights in MongoDB, return them
        if (flights && flights.length > 0) {
          console.log('Found flights in MongoDB:', flights.length);
          return { flights };
        }
      } catch (mongoError) {
        console.error('Error fetching from MongoDB:', mongoError);
        // Continue to fallback data if MongoDB fails
      }
      
      // Mock data for development
      const mockFlights = [
        {
          id: "flight-1",
          airline: "American Airlines",
          flightNumber: "AA123",
          departure: {
            code: params.departure || "JFK",
            city: params.departure || "New York",
            time: "08:45"
          },
          arrival: {
            code: params.destination || "LAX",
            city: params.destination || "Los Angeles",
            time: "13:15"
          },
          duration: "5h 30m",
          stops: 0,
          price: 350,
          currency: "USD",
          affiliateUrl: `https://www.skyscanner.com/transport/flights/${params.departure || "jfk"}/${params.destination || "lax"}/?adults=${params.passengers}&outbounddate=${params.departDate}&partner=${SKYSCANNER_API_KEY}`,
          originalUrl: "/travel/booking/flight/flight-1"
        },
        {
          id: "flight-2",
          airline: "Delta",
          flightNumber: "DL456",
          departure: {
            code: params.departure || "JFK",
            city: params.departure || "New York",
            time: "10:20"
          },
          arrival: {
            code: params.destination || "LAX",
            city: params.destination || "Los Angeles",
            time: "14:55"
          },
          duration: "5h 35m",
          stops: 0,
          price: 395,
          currency: "USD",
          affiliateUrl: `https://www.skyscanner.com/transport/flights/${params.departure || "jfk"}/${params.destination || "lax"}/?adults=${params.passengers}&outbounddate=${params.departDate}&partner=${SKYSCANNER_API_KEY}`,
          originalUrl: "/travel/booking/flight/flight-2"
        }
      ];
      
      // Store mock data in MongoDB for future use
      if (flights.length === 0) {
        try {
          for (const flight of mockFlights) {
            await mongoApiService.insertDocument('flights', flight);
          }
          console.log('Stored mock flights in MongoDB');
        } catch (insertError) {
          console.error('Error inserting mock flights to MongoDB:', insertError);
        }
      }
      
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { flights: mockFlights };
    } catch (error) {
      console.error('Error fetching flights:', error);
      throw new Error('Failed to fetch flights. Please try again.');
    }
  },
  
  // Get flight details with affiliate link
  getFlightDetails: async (id: string) => {
    try {
      console.log('Fetching flight details for:', id);
      
      // First try to fetch from MongoDB
      try {
        const flight = await mongoApiService.queryDocuments('flights', { id: id });
        if (flight && flight.length > 0) {
          return { flight: flight[0] };
        }
      } catch (mongoError) {
        console.error('Error fetching flight from MongoDB:', mongoError);
        // Continue to fallback data if MongoDB fails
      }
      
      // Fallback to mock data
      const flight = {
        id,
        airline: id === "flight-1" ? "American Airlines" : "Delta",
        flightNumber: id === "flight-1" ? "AA123" : "DL456",
        departure: {
          code: "JFK",
          city: "New York",
          time: id === "flight-1" ? "08:45" : "10:20"
        },
        arrival: {
          code: "LAX",
          city: "Los Angeles",
          time: id === "flight-1" ? "13:15" : "14:55"
        },
        duration: id === "flight-1" ? "5h 30m" : "5h 35m",
        stops: 0,
        price: id === "flight-1" ? 350 : 395,
        currency: "USD",
        affiliateUrl: `https://www.skyscanner.com/transport/flights/jfk/lax/?adults=1&partner=${SKYSCANNER_API_KEY}`
      };
      
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return { flight };
    } catch (error) {
      console.error('Error fetching flight details:', error);
      throw new Error('Failed to fetch flight details. Please try again.');
    }
  }
};

// Tour Guide API integration with MongoDB and TripAdvisor
const guideApi = {
  searchGuides: async (params: {
    destination: string,
    date: string,
    people: number
  }) => {
    try {
      console.log('Searching guides with params:', params);
      
      // First try to fetch from MongoDB
      let guides = [];
      try {
        // Query for guides matching the destination
        const query = params.destination ? 
          { location: { $regex: params.destination, $options: 'i' } } : 
          {};
          
        guides = await mongoApiService.queryDocuments('guides', query);
        
        // If we have guides in MongoDB, return them
        if (guides && guides.length > 0) {
          console.log('Found guides in MongoDB:', guides.length);
          return { guides };
        }
      } catch (mongoError) {
        console.error('Error fetching from MongoDB:', mongoError);
        // Continue to fallback data if MongoDB fails
      }
      
      // Mock data for development
      const mockGuides = [
        {
          id: "guide-1",
          name: "Elena Martinez",
          location: params.destination || "Barcelona, Spain",
          languages: ["English", "Spanish", "Catalan"],
          price: 75,
          currency: "USD",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
          rating: 4.9,
          reviewCount: 127,
          specialties: ["Architecture", "Food", "History"],
          availability: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
          affiliateUrl: `https://www.tripadvisor.com/Attraction_Review-d12345?affiliate_id=${TRIPADVISOR_AFFILIATE_ID}`,
          originalUrl: "/travel/booking/guide/guide-1"
        },
        {
          id: "guide-2",
          name: "Hiroshi Tanaka",
          location: params.destination || "Kyoto, Japan",
          languages: ["English", "Japanese"],
          price: 89,
          currency: "USD",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
          rating: 4.8,
          reviewCount: 92,
          specialties: ["Traditional Culture", "Gardens", "Tea Ceremony"],
          availability: ["Tuesday", "Wednesday", "Friday", "Sunday"],
          affiliateUrl: `https://www.tripadvisor.com/Attraction_Review-d67890?affiliate_id=${TRIPADVISOR_AFFILIATE_ID}`,
          originalUrl: "/travel/booking/guide/guide-2"
        }
      ];
      
      // Store mock data in MongoDB for future use
      if (guides.length === 0) {
        try {
          for (const guide of mockGuides) {
            await mongoApiService.insertDocument('guides', guide);
          }
          console.log('Stored mock guides in MongoDB');
        } catch (insertError) {
          console.error('Error inserting mock guides to MongoDB:', insertError);
        }
      }
      
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { guides: mockGuides };
    } catch (error) {
      console.error('Error fetching guides:', error);
      throw new Error('Failed to fetch guides. Please try again.');
    }
  },
  
  // Get guide details with affiliate link
  getGuideDetails: async (id: string) => {
    try {
      console.log('Fetching guide details for:', id);
      
      // First try to fetch from MongoDB
      try {
        const guide = await mongoApiService.queryDocuments('guides', { id: id });
        if (guide && guide.length > 0) {
          return { guide: guide[0] };
        }
      } catch (mongoError) {
        console.error('Error fetching guide from MongoDB:', mongoError);
        // Continue to fallback data if MongoDB fails
      }
      
      // Fallback to mock data
      const guide = {
        id,
        name: id === "guide-1" ? "Elena Martinez" : "Hiroshi Tanaka",
        location: id === "guide-1" ? "Barcelona, Spain" : "Kyoto, Japan",
        languages: id === "guide-1" ? ["English", "Spanish", "Catalan"] : ["English", "Japanese"],
        price: id === "guide-1" ? 75 : 89,
        currency: "USD",
        image: id === "guide-1" 
          ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        rating: id === "guide-1" ? 4.9 : 4.8,
        reviewCount: id === "guide-1" ? 127 : 92,
        specialties: id === "guide-1" 
          ? ["Architecture", "Food", "History"] 
          : ["Traditional Culture", "Gardens", "Tea Ceremony"],
        availability: id === "guide-1" 
          ? ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"]
          : ["Tuesday", "Wednesday", "Friday", "Sunday"],
        affiliateUrl: `https://www.tripadvisor.com/Attraction_Review-d${id === "guide-1" ? "12345" : "67890"}?affiliate_id=${TRIPADVISOR_AFFILIATE_ID}`
      };
      
      // Add a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return { guide };
    } catch (error) {
      console.error('Error fetching guide details:', error);
      throw new Error('Failed to fetch guide details. Please try again.');
    }
  }
};

// Create a booking management API
const bookingApi = {
  getAllBookings: async () => {
    try {
      console.log('Fetching all bookings');
      
      // Mock data for development
      const bookings = [
        {
          id: "booking-1",
          type: "flight",
          customerName: "John Smith",
          customerEmail: "john.smith@example.com",
          bookingDate: "2025-04-01",
          startDate: "2025-05-15",
          endDate: null,
          amount: 350,
          status: "confirmed",
          reference: "FL-123456",
          details: {
            flightNumber: "AA123",
            origin: "New York",
            destination: "Los Angeles",
            departureTime: "08:45",
            arrivalTime: "13:15",
            passengers: 1,
            airline: "American Airlines"
          }
        },
        {
          id: "booking-2",
          type: "hotel",
          customerName: "Sarah Johnson",
          customerEmail: "sarah.j@example.com",
          bookingDate: "2025-04-02",
          startDate: "2025-06-20",
          endDate: "2025-06-27",
          amount: 1199,
          status: "pending",
          reference: "HT-789012",
          details: {
            hotelName: "Grand Plaza Hotel",
            roomType: "Deluxe King",
            guests: 2,
            checkIn: "2025-06-20",
            checkOut: "2025-06-27"
          }
        },
        {
          id: "booking-3",
          type: "guide",
          customerName: "Michael Chen",
          customerEmail: "m.chen@example.com",
          bookingDate: "2025-04-03",
          startDate: "2025-05-10",
          endDate: null,
          amount: 75,
          status: "confirmed",
          reference: "GD-345678",
          details: {
            guideName: "Elena Martinez",
            tourType: "City Architecture",
            groupSize: 4,
            date: "2025-05-10",
            duration: "3 hours"
          }
        },
        {
          id: "booking-4",
          type: "flight",
          customerName: "Emily Wilson",
          customerEmail: "emily.w@example.com",
          bookingDate: "2025-04-05",
          startDate: "2025-07-12",
          endDate: null,
          amount: 425,
          status: "cancelled",
          reference: "FL-456789",
          details: {
            flightNumber: "DL456",
            origin: "Chicago",
            destination: "Miami",
            departureTime: "10:20",
            arrivalTime: "14:55",
            passengers: 1,
            airline: "Delta"
          }
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings. Please try again.');
    }
  },
  
  updateBookingStatus: async (id: string, status: string) => {
    try {
      console.log('Updating booking status:', id, status);
      
      // In a real app, this would call an API to update the status
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, message: `Booking ${id} status updated to ${status}` };
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error('Failed to update booking status. Please try again.');
    }
  }
};

// Export all APIs as travelService
export const travelService = {
  ...hotelApi,
  ...flightApi,
  ...guideApi,
  ...bookingApi
};

export { hotelApi, flightApi, guideApi };
