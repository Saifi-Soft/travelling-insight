
import { Schema, model, models } from 'mongodb';
import { Post } from '@/types/common';

// Post schema definition
const PostSchema = {
  title: String,
  slug: String,
  excerpt: String,
  author: {
    name: String,
    avatar: String,
    bio: String,
    social: {
      twitter: String,
      instagram: String,
      facebook: String
    }
  },
  category: String,
  coverImage: String,
  date: String,
  readTime: String,
  likes: Number,
  comments: Number,
  content: String,
  topics: [String],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: String,
    ogImage: String
  }
};

export { PostSchema };
