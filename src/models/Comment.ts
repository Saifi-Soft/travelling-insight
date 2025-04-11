
import { Comment } from '@/types/common';

// Comment schema definition
const CommentSchema = {
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
  content: String,
  date: String,
  likes: Number,
  replies: [{
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
    content: String,
    date: String,
    likes: Number
  }]
};

export { CommentSchema };
