
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
  author: Author;
  category: string;
  coverImage: string;
  date: string;
  readTime: string;
  likes: number;
  comments: number;
  content?: string;
  topics?: string[];
  seo?: SeoData;
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
