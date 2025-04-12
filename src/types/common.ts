// Define core types for the blog application

export interface Author {
  name: string;
  avatar: string;
  bio?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  count?: number;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

export interface Post {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
    social?: {
      twitter?: string;
      instagram?: string;
      facebook?: string;
    }
  };
  category: string;
  coverImage: string;
  content?: string;
  date: string;
  readTime: string;
  likes: number;
  comments: number;
  topics?: string[];
  clicks?: number;
  lastClickedAt?: Date | null;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogImage?: string;
  }
}

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

// MongoDB operator types
export interface MongoOperators {
  $in?: any[];
  // Add other MongoDB operators as needed
}

// Community types
export interface CommunityUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  name: string;
  bio?: string;
  joinDate: Date;
  lastActive?: Date;
  status: 'pending' | 'active' | 'blocked';
  experienceLevel: 'Newbie' | 'Casual' | 'Regular' | 'Experienced' | 'Globetrotter';
  travelStyles?: string[];
  visitedCountries?: {
    name: string;
    year: number;
  }[];
  wishlistDestinations?: string[];
  interests?: string[];
  badges?: {
    name: string;
    description: string;
    dateEarned: Date;
    icon: string;
  }[];
  reputation: number;
  socialProfiles?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface TravelGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  creator: string; // userId
  image?: string;
  members: string[]; // array of userIds
  topics?: string[];
  dateCreated: Date;
  status: 'active' | 'archived';
  featuredStatus: boolean;
  memberCount: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  host: string; // userId
  date: Date;
  endDate?: Date;
  location: {
    type: 'online' | 'physical';
    details: string; // Zoom link or address
  };
  image?: string;
  capacity?: number;
  attendees: string[]; // array of userIds
  status: 'upcoming' | 'ongoing' | 'completed' | 'canceled';
  category?: string;
  tags?: string[];
  createdAt: Date;
}

export interface TravelMatch {
  id: string;
  userId: string;
  preferences: {
    destinations: string[];
    dateRange?: {
      start?: Date;
      end?: Date;
    };
    travelStyles: string[];
    interests: string[];
    ageRange?: {
      min?: number;
      max?: number;
    };
    languages?: string[];
  };
  status: 'active' | 'paused' | 'closed';
  potentialMatches: {
    userId: string;
    compatibilityScore: number;
    status: 'pending' | 'accepted' | 'rejected';
  }[];
  createdAt: Date;
  updatedAt: Date;
}
