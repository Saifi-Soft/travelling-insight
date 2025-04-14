
// Travel Buddy Request schema definition
const TravelBuddyRequestSchema = {
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  destination: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  travelStyle: [{ type: String }], // Array of travel styles
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }
};

export { TravelBuddyRequestSchema };
