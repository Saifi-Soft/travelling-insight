
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

// Define Post interface
export interface Post {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content?: string;
  author: {
    id?: string;
    name: string;
    avatar: string;
  };
  date?: string;
  publishedAt?: Date;
  updatedAt?: Date;
  coverImage: string;
  category: string;
  tags?: string[];
  likes: number;
  comments: number;
  readTime: string;
  isFeatured?: boolean;
  clicks?: number;
}

// Define Category interface
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  image?: string;
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
  experienceLevel: string;
  travelStyles: string[];
  interests: string[];
  status: 'active' | 'blocked' | 'pending';
  joinDate: Date;
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
  id: string;
  title: string;
  description: string;
  type: string;
  host: string;
  date: Date;
  location: {
    type: 'online' | 'physical';
    details: string;
  };
  attendees: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'canceled';
  createdAt: Date;
}
