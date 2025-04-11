
// Travel Group schema for special interest groups
const TravelGroupSchema = {
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Solo female travelers, Family travel, etc.
  creator: { type: String, required: true }, // userId of creator
  image: { type: String },
  members: [{ type: String }], // array of userIds
  topics: [{ type: String }],
  dateCreated: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  featuredStatus: { type: Boolean, default: false },
  memberCount: { type: Number, default: 0 }
};

export { TravelGroupSchema };
