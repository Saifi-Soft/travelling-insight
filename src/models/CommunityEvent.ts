
// Community Event schema definition
const CommunityEventSchema = {
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true }, // Virtual meetup, Workshop, etc.
  host: { type: String, required: true }, // userId of host
  date: { type: Date, required: true },
  endDate: { type: Date },
  location: {
    type: { type: String, enum: ['online', 'physical'], default: 'online' }, // online or physical
    details: { type: String } // Zoom link or physical address
  },
  image: { type: String },
  capacity: { type: Number },
  attendees: [{ type: String }], // array of userIds
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'canceled'], default: 'upcoming' },
  category: { type: String }, // Travel photography, Language exchange, etc.
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
};

export { CommunityEventSchema };
