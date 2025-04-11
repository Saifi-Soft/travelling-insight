
import { connectToDatabase, formatMongoData, toObjectId, initializeDatabase, COLLECTIONS } from './mongodb';
import { Post, Category, Topic, Comment } from '@/types/common';

// Initialize database with sample data if empty
export async function initializeCollectionsWithSampleData(
  samplePosts: Post[], 
  sampleCategories: Category[],
  sampleTopics: Topic[]
) {
  try {
    await initializeDatabase();
    
    const { db } = await connectToDatabase();
    
    // Initialize posts if empty
    const postsCount = await db.collection(COLLECTIONS.POSTS).countDocuments();
    if (postsCount === 0 && samplePosts?.length) {
      const postsWithoutId = samplePosts.map(({ id, ...post }) => post);
      await db.collection(COLLECTIONS.POSTS).insertMany(postsWithoutId);
      console.log('Posts collection initialized with sample data');
    }
    
    // Initialize categories if empty
    const categoriesCount = await db.collection(COLLECTIONS.CATEGORIES).countDocuments();
    if (categoriesCount === 0 && sampleCategories?.length) {
      const categoriesWithoutId = sampleCategories.map(({ id, ...category }) => category);
      await db.collection(COLLECTIONS.CATEGORIES).insertMany(categoriesWithoutId);
      console.log('Categories collection initialized with sample data');
    }
    
    // Initialize topics if empty
    const topicsCount = await db.collection(COLLECTIONS.TOPICS).countDocuments();
    if (topicsCount === 0 && sampleTopics?.length) {
      const topicsWithoutId = sampleTopics.map(({ id, ...topic }) => topic);
      await db.collection(COLLECTIONS.TOPICS).insertMany(topicsWithoutId);
      console.log('Topics collection initialized with sample data');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing collections with sample data:', error);
    return false;
  }
}

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
  
  // Get post by slug
  getBySlug: async (slug: string): Promise<Post> => {
    try {
      const { db } = await connectToDatabase();
      const post = await db.collection(COLLECTIONS.POSTS).findOne({ slug });
      if (!post) throw new Error('Post not found');
      return formatMongoData(post);
    } catch (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
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
        .find({ category: category })
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
      
      // Generate slug if not provided
      if (!post.slug && post.title) {
        post.slug = post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      const result = await db.collection(COLLECTIONS.POSTS).insertOne(post);
      
      // Update category count
      if (post.category) {
        await db.collection(COLLECTIONS.CATEGORIES).updateOne(
          { name: post.category },
          { $inc: { count: 1 } }
        );
      }
      
      // Update topic counts
      if (post.topics && post.topics.length > 0) {
        for (const topicName of post.topics) {
          await db.collection(COLLECTIONS.TOPICS).updateOne(
            { name: topicName },
            { $inc: { count: 1 } },
            { upsert: true }
          );
        }
      }
      
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
      
      // Generate slug if title is changed and slug is not provided
      if (post.title && !post.slug) {
        post.slug = post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      // Get original post for category/topic updates
      const originalPost = await db.collection(COLLECTIONS.POSTS).findOne({ _id: toObjectId(id) });
      
      // Update the post
      await db.collection(COLLECTIONS.POSTS).updateOne(
        { _id: toObjectId(id) },
        { $set: post }
      );
      
      // Handle category change
      if (originalPost && post.category && originalPost.category !== post.category) {
        // Decrement old category count
        await db.collection(COLLECTIONS.CATEGORIES).updateOne(
          { name: originalPost.category },
          { $inc: { count: -1 } }
        );
        
        // Increment new category count
        await db.collection(COLLECTIONS.CATEGORIES).updateOne(
          { name: post.category },
          { $inc: { count: 1 } },
          { upsert: true }
        );
      }
      
      // Handle topic changes
      if (originalPost && post.topics) {
        // Decrement counts for removed topics
        const removedTopics = originalPost.topics?.filter(t => !post.topics?.includes(t)) || [];
        for (const topic of removedTopics) {
          await db.collection(COLLECTIONS.TOPICS).updateOne(
            { name: topic },
            { $inc: { count: -1 } }
          );
        }
        
        // Increment counts for new topics
        const newTopics = post.topics.filter(t => !originalPost.topics?.includes(t));
        for (const topic of newTopics) {
          await db.collection(COLLECTIONS.TOPICS).updateOne(
            { name: topic },
            { $inc: { count: 1 } },
            { upsert: true }
          );
        }
      }
      
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
      
      // Get the post before deletion for category/topic updates
      const post = await db.collection(COLLECTIONS.POSTS).findOne({ _id: toObjectId(id) });
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      // Delete the post
      const result = await db.collection(COLLECTIONS.POSTS).deleteOne({ _id: toObjectId(id) });
      
      if (result.deletedCount === 0) {
        throw new Error('Post not found');
      }
      
      // Decrement category count
      if (post.category) {
        await db.collection(COLLECTIONS.CATEGORIES).updateOne(
          { name: post.category },
          { $inc: { count: -1 } }
        );
      }
      
      // Decrement topic counts
      if (post.topics && post.topics.length > 0) {
        for (const topic of post.topics) {
          await db.collection(COLLECTIONS.TOPICS).updateOne(
            { name: topic },
            { $inc: { count: -1 } }
          );
        }
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
        const postsWithoutId = samplePosts.map(({ id, ...rest }) => rest);
        await db.collection(COLLECTIONS.POSTS).insertMany(postsWithoutId);
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
  
  getBySlug: async (slug: string): Promise<Category> => {
    try {
      const { db } = await connectToDatabase();
      const category = await db.collection(COLLECTIONS.CATEGORIES).findOne({ slug });
      if (!category) throw new Error('Category not found');
      return formatMongoData(category);
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      throw error;
    }
  },
  
  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    try {
      const { db } = await connectToDatabase();
      
      // Generate slug if not provided
      if (!category.slug && category.name) {
        category.slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
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
      
      // Generate slug if name is changed and slug is not provided
      if (category.name && !category.slug) {
        category.slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
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
      
      // Check if category is being used by any posts
      const category = await db.collection(COLLECTIONS.CATEGORIES).findOne({ _id: toObjectId(id) });
      if (!category) {
        throw new Error('Category not found');
      }
      
      // Check if any posts are using this category
      const postsUsingCategory = await db.collection(COLLECTIONS.POSTS).countDocuments({ category: category.name });
      if (postsUsingCategory > 0) {
        throw new Error(`Cannot delete: ${postsUsingCategory} posts are using this category`);
      }
      
      // Delete the category
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
        const categoriesWithoutId = sampleCategories.map(({ id, ...rest }) => rest);
        await db.collection(COLLECTIONS.CATEGORIES).insertMany(categoriesWithoutId);
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
  
  getById: async (id: string): Promise<Topic> => {
    try {
      const { db } = await connectToDatabase();
      const topic = await db.collection(COLLECTIONS.TOPICS).findOne({ _id: toObjectId(id) });
      if (!topic) throw new Error('Topic not found');
      return formatMongoData(topic);
    } catch (error) {
      console.error(`Error fetching topic ${id}:`, error);
      throw error;
    }
  },
  
  getBySlug: async (slug: string): Promise<Topic> => {
    try {
      const { db } = await connectToDatabase();
      const topic = await db.collection(COLLECTIONS.TOPICS).findOne({ slug });
      if (!topic) throw new Error('Topic not found');
      return formatMongoData(topic);
    } catch (error) {
      console.error(`Error fetching topic with slug ${slug}:`, error);
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
      
      // Generate slug if not provided
      if (!topic.slug && topic.name) {
        topic.slug = topic.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
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
      
      // Generate slug if name is changed and slug is not provided
      if (topic.name && !topic.slug) {
        topic.slug = topic.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
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
      
      // Check if topic is being used by any posts
      const topic = await db.collection(COLLECTIONS.TOPICS).findOne({ _id: toObjectId(id) });
      if (!topic) {
        throw new Error('Topic not found');
      }
      
      // Check if any posts are using this topic
      const postsUsingTopic = await db.collection(COLLECTIONS.POSTS).countDocuments({ topics: { $in: [topic.name] } });
      if (postsUsingTopic > 0) {
        throw new Error(`Cannot delete: ${postsUsingTopic} posts are using this topic`);
      }
      
      // Delete the topic
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
        const topicsWithoutId = sampleTopics.map(({ id, ...rest }) => rest);
        await db.collection(COLLECTIONS.TOPICS).insertMany(topicsWithoutId);
        console.log('Topics collection initialized with sample data');
      }
    } catch (error) {
      console.error('Error initializing topics collection:', error);
      throw error;
    }
  }
};

// Comments API with MongoDB
export const commentsApi = {
  getByPostId: async (postId: string): Promise<Comment[]> => {
    try {
      const { db } = await connectToDatabase();
      const comments = await db.collection(COLLECTIONS.COMMENTS)
        .find({ postId })
        .sort({ date: -1 })
        .toArray();
      return formatMongoData(comments);
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  },
  
  create: async (postId: string, comment: Omit<Comment, 'id'>): Promise<Comment> => {
    try {
      const { db } = await connectToDatabase();
      
      const commentWithPostId = {
        ...comment,
        postId,
        date: comment.date || new Date().toISOString()
      };
      
      const result = await db.collection(COLLECTIONS.COMMENTS).insertOne(commentWithPostId);
      
      // Update post comment count
      await db.collection(COLLECTIONS.POSTS).updateOne(
        { _id: toObjectId(postId) },
        { $inc: { comments: 1 } }
      );
      
      const newComment = { ...commentWithPostId, id: result.insertedId.toString() };
      return newComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },
  
  addReply: async (commentId: string, reply: Omit<Comment, 'id'>): Promise<Comment> => {
    try {
      const { db } = await connectToDatabase();
      
      const replyWithDate = {
        ...reply,
        date: reply.date || new Date().toISOString()
      };
      
      await db.collection(COLLECTIONS.COMMENTS).updateOne(
        { _id: toObjectId(commentId) },
        { $push: { replies: replyWithDate } }
      );
      
      const updatedComment = await db.collection(COLLECTIONS.COMMENTS).findOne({ _id: toObjectId(commentId) });
      if (!updatedComment) throw new Error('Comment not found after update');
      return formatMongoData(updatedComment);
    } catch (error) {
      console.error(`Error adding reply to comment ${commentId}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      const { db } = await connectToDatabase();
      
      const comment = await db.collection(COLLECTIONS.COMMENTS).findOne({ _id: toObjectId(id) });
      if (!comment) {
        throw new Error('Comment not found');
      }
      
      // Delete the comment
      const result = await db.collection(COLLECTIONS.COMMENTS).deleteOne({ _id: toObjectId(id) });
      
      if (result.deletedCount === 0) {
        throw new Error('Comment not found');
      }
      
      // Update post comment count
      if (comment.postId) {
        await db.collection(COLLECTIONS.POSTS).updateOne(
          { _id: toObjectId(comment.postId) },
          { $inc: { comments: -1 } }
        );
      }
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting comment ${id}:`, error);
      throw error;
    }
  }
};
