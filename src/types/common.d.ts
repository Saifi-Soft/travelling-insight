
export interface MongoOperators {
  $eq?: any;
  $gt?: number | Date;
  $gte?: number | Date;
  $lt?: number | Date;
  $lte?: number | Date;
  $in?: any[];
  $nin?: any[];
  $ne?: any;
  $exists?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content?: string;
  excerpt: string;
  slug?: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  coverImage: string;
  date: string;
  readTime: string;
  likes: number;
  comments: number;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  image: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  likes: number;
}

export interface CommunityUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  status: 'active' | 'blocked' | 'pending';
  travelStyles?: string[];
  interests: string[];
  joinedDate: string;
}

export interface TravelGroup {
  id: string;
  name: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  members: string[]; // User IDs
  capacity: number;
  createdBy: string; // User ID
  coverImage?: string;
  tags: string[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  attendees: string[]; // User IDs
  capacity: number;
  organizer: string; // User ID
  coverImage?: string;
  type: 'meetup' | 'workshop' | 'trip' | 'online';
}

export interface TravelMatch {
  userId: string;
  name: string;
  avatar: string;
  compatibilityScore: number;
  destinations: string[];
  travelStyles: string[];
  interests: string[];
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string; // In a real app, this would be properly hashed
  role: 'admin' | 'editor' | 'superadmin';
  createdAt: Date;
  lastLogin: Date;
}
