
import { Post, Category, Topic } from './common';

export interface SeoData {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
}

export interface MediaItem {
  id?: string;
  type: 'image' | 'youtube' | 'twitter' | 'pinterest';
  url: string;
  caption?: string;
}

export interface PostWithSeo extends Post {
  seo?: SeoData;
  mediaItems?: MediaItem[];
  topics?: string[];
}

export interface AnalyticsData {
  visitors: {
    total: number;
    change: number;
    data: { date: string; visitors: number }[];
  };
  posts: {
    total: number;
    published: number;
    draft: number;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    data: { name: string; views: number; engagement: number }[];
  };
  traffic: {
    sources: { name: string; value: number }[];
    referrers: { name: string; value: number }[];
  };
  bookings: {
    total: number;
    change: number;
    revenue: number;
    data: { month: string; flights: number; hotels: number; guides: number }[];
  };
}

export type BookingType = 'flight' | 'hotel' | 'guide';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

export interface Booking {
  id: string;
  type: BookingType;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  startDate: string;
  endDate?: string;
  amount: number;
  status: BookingStatus;
  reference: string;
  details: any; // Specific details based on booking type
}

export interface FlightBookingDetails {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  passengers: number;
  airline: string;
}

export interface HotelBookingDetails {
  hotelName: string;
  roomType: string;
  guests: number;
  checkIn: string;
  checkOut: string;
}

export interface GuideBookingDetails {
  guideName: string;
  tourType: string;
  groupSize: number;
  date: string;
  duration: string;
}
