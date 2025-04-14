// Define MongoDB-like operators for querying
export interface MongoOperators {
  $gt?: any;
  $gte?: any;
  $lt?: any;
  $lte?: any;
  $eq?: any;
  $ne?: any;
  $in?: any[];
  $nin?: any[];
}

// Define Author interface used in Post
export interface Author {
  id?: string;
  name: string;
  avatar: string;
  bio?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  }
}

// Define Post interface
export interface Post {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content?: string;
  author: Author;
  date: string; // Making this required to match the mongoApiService expectations
  publishedAt?: Date;
  updatedAt?: Date;
  coverImage: string;
  category: string;
  tags?: string[];
  topics?: string[]; // Adding this property since it's being used
  likes: number;
  comments: number;
  readTime: string;
  isFeatured?: boolean;
  clicks?: number;
  seo?: {  // Adding SEO property
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogImage?: string;
  }
}

// Define Category interface
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  image: string; // Making this required to match API expectations
}

// Define Topic/Hashtag interface
export interface Topic {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

// Define Comment interface
export interface Comment {
  id: string;
  postId: string;
  author: {
    id?: string;
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

// Community interfaces
export interface CommunityUser {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  experienceLevel: string;
  travelStyles: string[];
  interests: string[];
  status: 'active' | 'blocked' | 'pending';
  joinDate: Date;
  reputation: number;
  connections?: Array<string>;
  trips?: Array<any>;
  visitedCountries?: Array<{ 
    name: string;
    year: number;
  }>;
  wishlistDestinations?: string[];
  badges?: Array<{
    name: string;
    description: string;
    dateEarned?: Date;
    icon: string;
  }>;
  socialProfiles?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface TravelGroup {
  id: string;
  name: string;
  description?: string;
  category: string;
  members: string[];
  memberCount: number;
  owner: string;
  dateCreated: Date;
  status: 'active' | 'archived';
}

export interface CommunityEvent {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  type?: string;
  host?: string;
  date: string | Date;
  location: {
    type: 'online' | 'physical' | string;
    details: string;
  };
  attendees: Array<string | {id: string, name: string}>;
  status: 'upcoming' | 'ongoing' | 'completed' | 'canceled';
  createdAt: string | Date;
  organizer?: {id: string, name: string};
}

// Travel match interface for the intelligent matching feature
export interface TravelMatch {
  id?: string;
  userId: string;
  name: string;
  avatar?: string;
  compatibilityScore: number;
  destination?: string;
  dates?: {
    start: string;
    end: string;
  };
  destinations: string[];
  travelStyles: string[];
  interests: string[];
  languages?: string[];
}

// BuddyMatch interface to match the one used in TravelBuddyFinder.tsx
export interface BuddyMatch {
  _id?: string;
  userId: string;
  name: string;
  avatar?: string;
  destination: string;
  dates: {
    start: string;
    end: string;
  };
  compatibilityScore: number;
  travelStyles: string[];
  interests: string[];
  languages: string[];
}

// Community post interface
export interface CommunityPost {
  _id?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  images?: string[];
  location?: string;
  tags?: string[];
  createdAt: string;
  likes: number;
  comments: number;
  visibility?: 'public' | 'connections' | 'private';
}

// Message interface for community messaging
export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  text: string;
  time: string;
  read?: boolean;
  attachments?: {
    type: 'image' | 'file' | 'location';
    url: string;
    name?: string;
  }[];
}

// Conversation interface for community messaging
export interface Conversation {
  id: string;
  participants: string[];
  isGroup: boolean;
  name?: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: number;
  online?: boolean;
  members?: number;
}

// Travel buddy request interface
export interface TravelBuddyRequest {
  _id?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelStyle: string[];
  description: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
}
