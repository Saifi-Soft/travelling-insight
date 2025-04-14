
// Community Post schema definition
const CommunityPostSchema = {
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  content: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs
  location: { type: String },
  tags: [{ type: String }], // Array of tag strings
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  visibility: { type: String, enum: ['public', 'connections', 'private'], default: 'public' },
  // New fields for content moderation
  moderated: { type: Boolean, default: false },
  moderationReason: { type: String },
  moderatedAt: { type: Date }
};

export { CommunityPostSchema };
