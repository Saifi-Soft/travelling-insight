
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

// Travel match interface for the intelligent matching feature
export interface TravelMatch {
  id?: string;
  userId: string;
  name: string; // Making this required as per the error message
  avatar?: string;
  compatibilityScore: number;
  destinations: string[];
  travelStyles: string[];
  interests: string[];
}
