
import { MongoOperators } from '@/types/common';

// Community User schema definition for MongoDB
const CommunityUserSchema = {
  username: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String },
  name: { type: String, required: true },
  bio: { type: String },
  joinDate: { type: Date, default: Date.now },
  lastActive: { type: Date },
  status: { type: String, enum: ['pending', 'active', 'blocked'], default: 'pending' },
  experienceLevel: { type: String, enum: ['Newbie', 'Casual', 'Regular', 'Experienced', 'Globetrotter'], default: 'Newbie' },
  travelStyles: [{ type: String }], // Luxury, Budget, Adventure, etc.
  visitedCountries: [{ 
    name: { type: String },
    year: { type: Number }
  }],
  wishlistDestinations: [{ type: String }],
  interests: [{ type: String }],
  badges: [{
    name: { type: String },
    description: { type: String },
    dateEarned: { type: Date },
    icon: { type: String }
  }],
  reputation: { type: Number, default: 0 },
  socialProfiles: {
    instagram: { type: String },
    twitter: { type: String },
    facebook: { type: String }
  }
};

export { CommunityUserSchema };
