
// Type definitions for the application

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

// Post type
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  featuredImage?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: string[];
  publishedAt: string;
  status: 'draft' | 'published' | 'archived';
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Topic/Hashtag type
export interface Topic {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  followerCount: number;
  isPromoted?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Comment type
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  parentId?: string;
  likes: number;
  createdAt: string;
  updatedAt?: string;
}

// Community user type
export interface CommunityUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  travelStyles?: string[];
  visitedCountries?: string[];
  connections?: string[];
  trips?: string[];
  createdAt: string;
  updatedAt?: string;
}

// Travel group type
export interface TravelGroup {
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

// Community event type
export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: {
    type: 'online' | 'in-person';
    details: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendees: Array<{
    id: string;
    name: string;
  }>;
  organizer: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt?: string;
}

// Hashtag type for management
export interface Hashtag {
  id: string;
  name: string;
  count: number;
  trending?: boolean;
  createdAt: string;
}

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
