
import { connectToDatabase, formatMongoData, toObjectId } from './mongodb';
import { Post, Category, Topic } from '@/types/common';

// Collections
const COLLECTIONS = {
  POSTS: 'posts',
  CATEGORIES: 'categories',
  TOPICS: 'topics'
};

// Posts API with MongoDB
export const postsApi = {
  // Get all posts
  getAll: async (): Promise<Post[]> => {
    try {
      const { db } = await connectToDatabase();
      const posts = await db.collection(COLLECTIONS.POSTS).find({}).toArray();
      return formatMongoData(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },
  
  // Get post by ID
  getById: async (id: string): Promise<Post> => {
    try {
      const { db } = await connectToDatabase();
      const post = await db.collection(COLLECTIONS.POSTS).findOne({ _id: toObjectId(id) });
      if (!post) throw new Error('Post not found');
      return formatMongoData(post);
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  },
  
  getFeatured: async (): Promise<Post[]> => {
    try {
      const { db } = await connectToDatabase();
      const featuredPosts = await db.collection(COLLECTIONS.POSTS)
        .find({ featured: true })
        .limit(3)
        .toArray();
      return formatMongoData(featuredPosts);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      throw error;
    }
  },
  
  getTrending: async (): Promise<Post[]> => {
    try {
      const { db } = await connectToDatabase();
      const trendingPosts = await db.collection(COLLECTIONS.POSTS)
        .find({})
        .sort({ likes: -1 })
        .limit(4)
        .toArray();
      return formatMongoData(trendingPosts);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      throw error;
    }
  },
  
  getByCategory: async (category: string): Promise<Post[]> => {
    try {
      const { db } = await connectToDatabase();
      const posts = await db.collection(COLLECTIONS.POSTS)
        .find({ category: { $regex: new RegExp(category, 'i') } })
        .toArray();
      return formatMongoData(posts);
    } catch (error) {
      console.error(`Error fetching posts for category ${category}:`, error);
      throw error;
    }
  },
  
  getByTag: async (tag: string): Promise<Post[]> => {
    try {
      const { db } = await connectToDatabase();
      const posts = await db.collection(COLLECTIONS.POSTS)
        .find({ topics: { $in: [tag] } })
        .toArray();
      return formatMongoData(posts);
    } catch (error) {
      console.error(`Error fetching posts for tag ${tag}:`, error);
      throw error;
    }
  },
  
  // Admin operations
  create: async (post: Omit<Post, 'id'>): Promise<Post> => {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection(COLLECTIONS.POSTS).insertOne(post);
      const newPost = { ...post, id: result.insertedId.toString() };
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },
  
  update: async (id: string, post: Partial<Post>): Promise<Post> => {
    try {
      const { db } = await connectToDatabase();
      await db.collection(COLLECTIONS.POSTS).updateOne(
        { _id: toObjectId(id) },
        { $set: post }
      );
      
      const updatedPost = await db.collection(COLLECTIONS.POSTS).findOne({ _id: toObjectId(id) });
      if (!updatedPost) throw new Error('Post not found after update');
      return formatMongoData(updatedPost);
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection(COLLECTIONS.POSTS).deleteOne({ _id: toObjectId(id) });
      
      if (result.deletedCount === 0) {
        throw new Error('Post not found');
      }
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  },
  
  // Initialize the posts collection with sample data if empty
  initializeCollection: async (samplePosts: Post[]): Promise<void> => {
    try {
      const { db } = await connectToDatabase();
      const count = await db.collection(COLLECTIONS.POSTS).countDocuments();
      
      if (count === 0) {
        await db.collection(COLLECTIONS.POSTS).insertMany(samplePosts);
        console.log('Posts collection initialized with sample data');
      }
    } catch (error) {
      console.error('Error initializing posts collection:', error);
      throw error;
    }
  }
};

// Categories API with MongoDB
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      const { db } = await connectToDatabase();
      const categories = await db.collection(COLLECTIONS.CATEGORIES).find({}).toArray();
      return formatMongoData(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<Category> => {
    try {
      const { db } = await connectToDatabase();
      const category = await db.collection(COLLECTIONS.CATEGORIES).findOne({ _id: toObjectId(id) });
      if (!category) throw new Error('Category not found');
      return formatMongoData(category);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },
  
  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection(COLLECTIONS.CATEGORIES).insertOne({
        ...category,
        count: category.count || 0
      });
      const newCategory = { ...category, id: result.insertedId.toString() };
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },
  
  update: async (id: string, category: Partial<Category>): Promise<Category> => {
    try {
      const { db } = await connectToDatabase();
      await db.collection(COLLECTIONS.CATEGORIES).updateOne(
        { _id: toObjectId(id) },
        { $set: category }
      );
      
      const updatedCategory = await db.collection(COLLECTIONS.CATEGORIES).findOne({ _id: toObjectId(id) });
      if (!updatedCategory) throw new Error('Category not found after update');
      return formatMongoData(updatedCategory);
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection(COLLECTIONS.CATEGORIES).deleteOne({ _id: toObjectId(id) });
      
      if (result.deletedCount === 0) {
        throw new Error('Category not found');
      }
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },
  
  // Initialize the categories collection with sample data if empty
  initializeCollection: async (sampleCategories: Category[]): Promise<void> => {
    try {
      const { db } = await connectToDatabase();
      const count = await db.collection(COLLECTIONS.CATEGORIES).countDocuments();
      
      if (count === 0) {
        await db.collection(COLLECTIONS.CATEGORIES).insertMany(sampleCategories);
        console.log('Categories collection initialized with sample data');
      }
    } catch (error) {
      console.error('Error initializing categories collection:', error);
      throw error;
    }
  }
};

// Topics/Hashtags API with MongoDB
export const topicsApi = {
  getAll: async (): Promise<Topic[]> => {
    try {
      const { db } = await connectToDatabase();
      const topics = await db.collection(COLLECTIONS.TOPICS).find({}).toArray();
      return formatMongoData(topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  },
  
  getTrending: async (): Promise<Topic[]> => {
    try {
      const { db } = await connectToDatabase();
      const trendingTopics = await db.collection(COLLECTIONS.TOPICS)
        .find({})
        .sort({ count: -1 })
        .limit(5)
        .toArray();
      return formatMongoData(trendingTopics);
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      throw error;
    }
  },
  
  create: async (topic: Omit<Topic, 'id'>): Promise<Topic> => {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection(COLLECTIONS.TOPICS).insertOne({
        ...topic,
        count: topic.count || 0
      });
      const newTopic = { ...topic, id: result.insertedId.toString() };
      return newTopic;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  },
  
  update: async (id: string, topic: Partial<Topic>): Promise<Topic> => {
    try {
      const { db } = await connectToDatabase();
      await db.collection(COLLECTIONS.TOPICS).updateOne(
        { _id: toObjectId(id) },
        { $set: topic }
      );
      
      const updatedTopic = await db.collection(COLLECTIONS.TOPICS).findOne({ _id: toObjectId(id) });
      if (!updatedTopic) throw new Error('Topic not found after update');
      return formatMongoData(updatedTopic);
    } catch (error) {
      console.error(`Error updating topic ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection(COLLECTIONS.TOPICS).deleteOne({ _id: toObjectId(id) });
      
      if (result.deletedCount === 0) {
        throw new Error('Topic not found');
      }
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting topic ${id}:`, error);
      throw error;
    }
  },
  
  // Initialize the topics collection with sample data if empty
  initializeCollection: async (sampleTopics: Topic[]): Promise<void> => {
    try {
      const { db } = await connectToDatabase();
      const count = await db.collection(COLLECTIONS.TOPICS).countDocuments();
      
      if (count === 0) {
        await db.collection(COLLECTIONS.TOPICS).insertMany(sampleTopics);
        console.log('Topics collection initialized with sample data');
      }
    } catch (error) {
      console.error('Error initializing topics collection:', error);
      throw error;
    }
  }
};
