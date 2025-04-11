
import { Schema, model, models } from 'mongodb';
import { Topic } from '@/types/common';

// Topic schema definition
const TopicSchema = {
  name: String,
  slug: String,
  count: Number
};

export { TopicSchema };
