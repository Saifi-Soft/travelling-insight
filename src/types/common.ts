
// Common types for the application
import { DbDocument } from '@/api/mongoDbService';

// MongoDB operators
export interface MongoOperators {
  $eq?: any;
  $gt?: any;
  $gte?: any;
  $in?: any[];
  $lt?: any;
  $lte?: any;
  $ne?: any;
  $nin?: any[];
  $and?: any[];
  $not?: any;
  $nor?: any[];
  $or?: any[];
  $exists?: boolean;
  $regex?: string;
  $options?: string;
}

// Topic type
export interface Topic extends DbDocument {
  name: string;
  count?: number;
  slug: string;
  postCount?: number;
  followerCount?: number;
  isPromoted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Category type
export interface Category extends DbDocument {
  name: string;
  slug: string;
  icon?: string;
  count: number;
  image?: string;
  description?: string;
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Post author type
export interface Author {
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
  id?: string;
}

// Post type
export interface Post extends DbDocument {
  title: string;
  excerpt?: string;
  content?: string;
  author: Author | string;
  category?: string | {
    id: string;
    name: string;
    slug: string;
  };
  coverImage?: string;
  featuredImage?: string;
  likes: number;
  date: string;
  readTime?: string;
  comments: number;
  topics?: string[];
  tags?: string[];
  slug?: string;
  status?: 'draft' | 'published' | 'archived';
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Comment type
export interface Comment extends DbDocument {
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
  parentId?: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

// Community Event Location
export interface EventLocation {
  type: 'online' | 'in-person';
  details: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Community Event Attendee
export interface EventAttendee {
  id: string;
  name: string;
}

// Community Event
export interface CommunityEvent extends DbDocument {
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: EventLocation;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendees: EventAttendee[] | string[];
  organizer: EventAttendee;
  createdAt: string;
  updatedAt?: string;
  image?: string;
}

// Community Post
export interface PostProps extends DbDocument {
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  images?: string[];
  location?: string;
  createdAt: string;
  likes: number;
  comments: number;
  likedBy?: string[];
}

// Community User Badge
export interface UserBadge {
  name: string;
  description: string;
  dateEarned?: string;
}

// Community User Visited Country
export interface VisitedCountry {
  name: string;
  year: number;
}

// Community User
export interface CommunityUser extends DbDocument {
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  experienceLevel?: string;
  website?: string;
  travelStyles?: string[];
  interests?: string[];
  visitedCountries?: VisitedCountry[];
  wishlistDestinations?: string[];
  connections?: string[];
  trips?: string[];
  badges?: UserBadge[];
  createdAt?: string;
  updatedAt?: string;
}

// Hashtag type
export interface Hashtag extends DbDocument {
  name: string;
  slug: string;
  count?: number;
  trending?: boolean;
  createdAt?: string;
}

// Site Settings
export interface SiteSettings extends DbDocument {
  general?: {
    siteTitle: string;
    siteDescription: string;
    contactEmail: string;
    footerText: string;
    maintenanceMode: boolean;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImageUrl: string;
  };
  social?: {
    facebookUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    pinterestUrl: string;
  };
  notifications?: {
    enableEmailNotifications: boolean;
    adminEmailNotifications: boolean;
    commentNotifications: boolean;
    subscriptionNotifications: boolean;
  };
  analytics?: {
    googleAnalyticsId: string;
    facebookPixelId: string;
    enableAnalytics: boolean;
  };
  cookieConsent?: {
    requireCookieConsent: boolean;
    message: string;
  };
  api?: {
    apiKeysEnabled: boolean;
    rateLimit: string;
  };
  security?: {
    twoFactorAuth: boolean;
    passwordPolicy: string;
    sessionTimeout: string;
  };
  backup?: {
    autoBackup: boolean;
    backupFrequency: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Travel Group type
export interface TravelGroup extends DbDocument {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  members: Array<{
    userId: string;
    name: string;
    role: 'admin' | 'moderator' | 'member';
    joinedAt: string;
  }>;
  isPrivate: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

// Travel Match type for buddy matching
export interface TravelMatch extends DbDocument {
  id: string;
  userId: string;
  matchUserId: string;
  name?: string; // Added for compatibility
  avatar?: string; // Added for compatibility
  compatibilityScore: number;
  status: 'pending' | 'accepted' | 'rejected';
  destinations?: string[]; // Added for compatibility
  travelStyles?: string[]; // Added for compatibility
  interests?: string[]; // Added for compatibility
  dates?: {
    start: string;
    end: string;
  }; // Added for compatibility
  createdAt: string;
}

// Buddy Match type
export interface BuddyMatch extends DbDocument {
  id: string;
  userId: string;
  matchUserId: string;
  userName: string;
  matchUserName: string;
  compatibilityScore: number;
  matchedInterests: string[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Notification type
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  linkTo?: string;
  data?: any;
  createdAt: string;
  readAt?: string;
}
