
import { MongoOperators } from '@/types/common';

// Trip schema definition for MongoDB
const TripSchema = {
  userId: { type: String, required: true },
  type: { type: String, enum: ['hotel', 'flight', 'guide'], required: true },
  status: { type: String, enum: ['planned', 'confirmed', 'cancelled', 'completed'], default: 'planned' },
  bookingReference: { type: String },
  editCount: { type: Number, default: 0 },
  details: {
    title: { type: String, required: true },
    destinationLocation: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    price: { type: Number },
    currency: { type: String, default: 'USD' },
    guests: { type: Number, default: 1 },
    
    // Fields specific to different trip types
    // Hotel specific
    hotelName: { type: String },
    hotelId: { type: String },
    roomType: { type: String },
    
    // Flight specific
    airline: { type: String },
    flightNumber: { type: String },
    departureLocation: { type: String },
    departureTime: { type: String },
    arrivalTime: { type: String },
    
    // Guide specific
    guideName: { type: String },
    guideId: { type: String },
    tourType: { type: String },
    duration: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

// Define the model interface for TypeScript
interface Trip {
  _id?: string;
  userId: string;
  type: 'hotel' | 'flight' | 'guide';
  status: 'planned' | 'confirmed' | 'cancelled' | 'completed';
  bookingReference?: string;
  editCount: number;
  details: {
    title: string;
    destinationLocation: string;
    startDate: Date;
    endDate?: Date;
    price?: number;
    currency?: string;
    guests?: number;
    
    // Fields specific to different trip types
    hotelName?: string;
    hotelId?: string;
    roomType?: string;
    
    airline?: string;
    flightNumber?: string;
    departureLocation?: string;
    departureTime?: string;
    arrivalTime?: string;
    
    guideName?: string;
    guideId?: string;
    tourType?: string;
    duration?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Create MongoDB collection name
const COLLECTION_NAME = 'trips';

export { TripSchema, COLLECTION_NAME };
export type { Trip };
