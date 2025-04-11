
import { Topic } from '@/types/common';

// Topic schema definition for our MongoDB-like storage
const TopicSchema = {
  name: { type: String, required: true },
  slug: { type: String, required: true },
  count: { type: Number, default: 0 }
};

export { TopicSchema };
