
import mongoose from 'mongoose';
import { Category } from '@/types/common';

// Category schema definition
const CategorySchema = {
  name: { type: String, required: true },
  slug: { type: String, required: true },
  icon: { type: String, default: '📁' },
  image: { type: String },
  count: { type: Number, default: 0 }
};

export { CategorySchema };
