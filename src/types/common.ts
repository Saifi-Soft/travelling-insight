
// Common types for the application
import { DbDocument } from '@/api/mongoDbService';

// Topic type
export interface Topic extends DbDocument {
  name: string;
  count?: number;
  slug: string;
}

// Category type
export interface Category extends DbDocument {
  name: string;
  slug: string;
  icon?: string;
  count: number;
  image?: string;
  description?: string;
}

// Post author type
export interface Author {
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
}

// Post type
export interface Post extends DbDocument {
  title: string;
  excerpt?: string;
  content?: string;
  author: Author | string;
  category?: string;
  coverImage?: string;
  likes: number;
  date: string;
  readTime?: string;
  comments: number;
  topics?: string[];
  tags?: string[];
}

// Comment type
export interface Comment extends DbDocument {
  postId: string;
  userId: string;
  userName: string;
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
  parentId?: string;
}

// Community Event Location
export interface EventLocation {
  type: 'online' | 'in-person';
  details: string;
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
  location: EventLocation;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendees: EventAttendee[] | string[];
  organizer: EventAttendee;
  createdAt: string;
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
}

// Hashtag type
export interface Hashtag extends DbDocument {
  name: string;
  slug: string;
  count?: number;
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
