
import { MongoOperators } from '@/types/common';

// Subscription schema definition for MongoDB
const SubscriptionSchema = {
  userId: { type: String, required: true },
  planType: { type: String, enum: ['monthly', 'annual'], required: true },
  status: { type: String, enum: ['active', 'canceled', 'expired'], default: 'active' },
  paymentMethod: {
    method: { type: String, required: true },
    cardLastFour: { type: String },
    expiryDate: { type: String }
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  autoRenew: { type: Boolean, default: true },
  canceledAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

// Define the model interface for TypeScript
interface Subscription {
  id?: string;
  userId: string;
  planType: 'monthly' | 'annual';
  status: 'active' | 'canceled' | 'expired';
  paymentMethod: {
    method: string;
    cardLastFour?: string;
    expiryDate?: string;
  };
  startDate: Date;
  endDate: Date;
  amount: number;
  autoRenew: boolean;
  canceledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create MongoDB collection name
const COLLECTION_NAME = 'subscriptions';

export { SubscriptionSchema, COLLECTION_NAME, Subscription };
