
import mongoose from 'mongoose';
import { Comment } from '@/types/common';

// Comment schema definition
const CommentSchema = {
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
  content: { type: String, required: true },
  date: { type: String, required: true },
  likes: { type: Number, default: 0 },
  postId: { type: String, required: true },
  replies: [{
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
    content: { type: String, required: true },
    date: { type: String, required: true },
    likes: { type: Number, default: 0 }
  }]
};

export { CommentSchema };
