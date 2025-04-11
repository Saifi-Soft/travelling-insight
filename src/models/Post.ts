
import { Post } from '@/types/common';

// Post schema definition for our MongoDB-like storage
const PostSchema = {
  title: { type: String, required: true },
  slug: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
    social: {
      twitter: { type: String },
      instagram: { type: String },
      facebook: { type: String }
    }
  },
  category: { type: String, required: true },
  coverImage: { type: String, required: true },
  date: { type: String, required: true },
  readTime: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  content: { type: String },
  topics: [{ type: String }],
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String },
    ogImage: { type: String }
  }
};

export { PostSchema };
