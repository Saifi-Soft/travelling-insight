
// Travel Match schema for buddy matching
const TravelMatchSchema = {
  userId: { type: String, required: true },
  preferences: {
    destinations: [{ type: String }],
    dateRange: {
      start: { type: Date },
      end: { type: Date }
    },
    travelStyles: [{ type: String }],
    interests: [{ type: String }],
    ageRange: {
      min: { type: Number },
      max: { type: Number }
    },
    languages: [{ type: String }]
  },
  status: { type: String, enum: ['active', 'paused', 'closed'], default: 'active' },
  potentialMatches: [{
    userId: { type: String },
    compatibilityScore: { type: Number },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

export { TravelMatchSchema };
