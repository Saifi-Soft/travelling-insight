
import { Category } from '@/types/common';

// Category schema definition for our MongoDB-like storage
const CategorySchema = {
  name: { type: String, required: true },
  slug: { type: String, required: true },
  icon: { type: String, default: '📁' },
  image: { type: String },
  count: { type: Number, default: 0 }
};

export { CategorySchema };
