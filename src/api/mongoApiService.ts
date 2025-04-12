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
    
    const { collections } = await connectToDatabase();
    
    // Initialize posts if empty
    const postsCount = await collections.posts.countDocuments();
    if (postsCount === 0 && samplePosts?.length) {
      const postsWithoutId = samplePosts.map(({ id, ...post }) => post);
      await collections.posts.insertMany(postsWithoutId);
      console.log('Posts collection initialized with sample data');
    }
    
    // Initialize categories if empty
    const categoriesCount = await collections.categories.countDocuments();
    if (categoriesCount === 0 && sampleCategories?.length) {
      const categoriesWithoutId = sampleCategories.map(({ id, ...category }) => category);
      await collections.categories.insertMany(categoriesWithoutId);
      console.log('Categories collection initialized with sample data');
    }
    
    // Initialize topics if empty
    const topicsCount = await collections.topics.countDocuments();
    if (topicsCount === 0 && sampleTopics?.length) {
      const topicsWithoutId = sampleTopics.map(({ id, ...topic }) => topic);
      await collections.topics.insertMany(topicsWithoutId);
      console.log('Topics collection initialized with sample data');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing collections with sample data:', error);
    return false;
  }
}

// Posts API
export const postsApi = {
  // Get all posts
  getAll: async (): Promise<Post[]> => {
    try {
      const { collections } = await connectToDatabase();
      const posts = await collections.posts.find().toArray();
      return formatMongoData(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },
  
  // Get post by ID
  getById: async (id: string): Promise<Post> => {
    try {
      const { collections } = await connectToDatabase();
      const post = await collections.posts.findOne({ _id: id });
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
      const { collections } = await connectToDatabase();
      const post = await collections.posts.findOne({ slug });
      if (!post) throw new Error('Post not found');
      return formatMongoData(post);
    } catch (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
      throw error;
    }
  },
  
  getFeatured: async (): Promise<Post[]> => {
    try {
      const { collections } = await connectToDatabase();
      const featuredPosts = await collections.posts
        .find()
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
      const { collections } = await connectToDatabase();
      const trendingPosts = await collections.posts
        .find()
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
      const { collections } = await connectToDatabase();
      const posts = await collections.posts
        .find()
        .toArray();
      const filteredPosts = posts.filter(post => post.category === category);
      return formatMongoData(filteredPosts);
    } catch (error) {
      console.error(`Error fetching posts for category ${category}:`, error);
      throw error;
    }
  },
  
  getByTag: async (tag: string): Promise<Post[]> => {
    try {
      const { collections } = await connectToDatabase();
      const posts = await collections.posts
        .find()
        .toArray();
      const filteredPosts = posts.filter(post => 
        post.topics && post.topics.includes(tag)
      );
      return formatMongoData(filteredPosts);
    } catch (error) {
      console.error(`Error fetching posts for tag ${tag}:`, error);
      throw error;
    }
  },
  
  // Admin operations
  create: async (post: Omit<Post, 'id'>): Promise<Post> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Generate slug if not provided
      if (!post.slug && post.title) {
        post.slug = post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      const result = await collections.posts.insertOne(post);
      
      // Update category count
      if (post.category) {
        await collections.categories.updateOne(
          { name: post.category },
          { $inc: { count: 1 } }
        );
      }
      
      // Update topic counts
      if (post.topics && post.topics.length > 0) {
        for (const topicName of post.topics) {
          await collections.topics.updateOne(
            { name: topicName },
            { $inc: { count: 1 } }
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
      const { collections } = await connectToDatabase();
      
      // Generate slug if title is changed and slug is not provided
      if (post.title && !post.slug) {
        post.slug = post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      // Get original post for category/topic updates
      const originalPost = await collections.posts.findOne({ _id: id });
      
      // Update the post
      await collections.posts.updateOne(
        { _id: id },
        { $set: post }
      );
      
      // Handle category change
      if (originalPost && post.category && originalPost.category !== post.category) {
        // Decrement old category count
        await collections.categories.updateOne(
          { name: originalPost.category },
          { $inc: { count: -1 } }
        );
        
        // Increment new category count
        await collections.categories.updateOne(
          { name: post.category },
          { $inc: { count: 1 } }
        );
      }
      
      // Handle topic changes
      if (originalPost && post.topics) {
        // Decrement counts for removed topics
        const removedTopics = originalPost.topics?.filter(t => !post.topics?.includes(t)) || [];
        for (const topic of removedTopics) {
          await collections.topics.updateOne(
            { name: topic },
            { $inc: { count: -1 } }
          );
        }
        
        // Increment counts for new topics
        const newTopics = post.topics.filter(t => !originalPost.topics?.includes(t));
        for (const topic of newTopics) {
          await collections.topics.updateOne(
            { name: topic },
            { $inc: { count: 1 } }
          );
        }
      }
      
      const updatedPost = await collections.posts.findOne({ _id: id });
      if (!updatedPost) throw new Error('Post not found after update');
      return formatMongoData(updatedPost);
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Get the post before deletion for category/topic updates
      const post = await collections.posts.findOne({ _id: id });
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      // Delete the post
      const result = await collections.posts.deleteOne({ _id: id });
      
      if (result.deletedCount === 0) {
        throw new Error('Post not found');
      }
      
      // Decrement category count
      if (post.category) {
        await collections.categories.updateOne(
          { name: post.category },
          { $inc: { count: -1 } }
        );
      }
      
      // Decrement topic counts
      if (post.topics && post.topics.length > 0) {
        for (const topic of post.topics) {
          await collections.topics.updateOne(
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
  }
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      const { collections } = await connectToDatabase();
      const categories = await collections.categories.find().toArray();
      return formatMongoData(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<Category> => {
    try {
      const { collections } = await connectToDatabase();
      const category = await collections.categories.findOne({ _id: id });
      if (!category) throw new Error('Category not found');
      return formatMongoData(category);
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },
  
  getBySlug: async (slug: string): Promise<Category> => {
    try {
      const { collections } = await connectToDatabase();
      const category = await collections.categories.findOne({ slug });
      if (!category) throw new Error('Category not found');
      return formatMongoData(category);
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      throw error;
    }
  },
  
  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Generate slug if not provided
      if (!category.slug && category.name) {
        category.slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      const result = await collections.categories.insertOne({
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
      const { collections } = await connectToDatabase();
      
      // Generate slug if name is changed and slug is not provided
      if (category.name && !category.slug) {
        category.slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      await collections.categories.updateOne(
        { _id: id },
        { $set: category }
      );
      
      const updatedCategory = await collections.categories.findOne({ _id: id });
      if (!updatedCategory) throw new Error('Category not found after update');
      return formatMongoData(updatedCategory);
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Check if category is being used by any posts
      const category = await collections.categories.findOne({ _id: id });
      if (!category) {
        throw new Error('Category not found');
      }
      
      // Check if any posts are using this category
      const posts = await collections.posts.find().toArray();
      const postsUsingCategory = posts.filter(post => post.category === category.name).length;
      
      if (postsUsingCategory > 0) {
        throw new Error(`Cannot delete: ${postsUsingCategory} posts are using this category`);
      }
      
      // Delete the category
      const result = await collections.categories.deleteOne({ _id: id });
      
      if (result.deletedCount === 0) {
        throw new Error('Category not found');
      }
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }
};

// Topics/Hashtags API
export const topicsApi = {
  getAll: async (): Promise<Topic[]> => {
    try {
      const { collections } = await connectToDatabase();
      const topics = await collections.topics.find().toArray();
      return formatMongoData(topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<Topic> => {
    try {
      const { collections } = await connectToDatabase();
      const topic = await collections.topics.findOne({ _id: id });
      if (!topic) throw new Error('Topic not found');
      return formatMongoData(topic);
    } catch (error) {
      console.error(`Error fetching topic ${id}:`, error);
      throw error;
    }
  },
  
  getBySlug: async (slug: string): Promise<Topic> => {
    try {
      const { collections } = await connectToDatabase();
      const topic = await collections.topics.findOne({ slug });
      if (!topic) throw new Error('Topic not found');
      return formatMongoData(topic);
    } catch (error) {
      console.error(`Error fetching topic with slug ${slug}:`, error);
      throw error;
    }
  },
  
  getTrending: async (): Promise<Topic[]> => {
    try {
      const { collections } = await connectToDatabase();
      const trendingTopics = await collections.topics
        .find()
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
      const { collections } = await connectToDatabase();
      
      // Generate slug if not provided
      if (!topic.slug && topic.name) {
        topic.slug = topic.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      const result = await collections.topics.insertOne({
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
      const { collections } = await connectToDatabase();
      
      // Generate slug if name is changed and slug is not provided
      if (topic.name && !topic.slug) {
        topic.slug = topic.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      await collections.topics.updateOne(
        { _id: id },
        { $set: topic }
      );
      
      const updatedTopic = await collections.topics.findOne({ _id: id });
      if (!updatedTopic) throw new Error('Topic not found after update');
      return formatMongoData(updatedTopic);
    } catch (error) {
      console.error(`Error updating topic ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Check if topic is being used by any posts
      const topic = await collections.topics.findOne({ _id: id });
      if (!topic) {
        throw new Error('Topic not found');
      }
      
      // Check if any posts are using this topic
      const posts = await collections.posts.find().toArray();
      const postsUsingTopic = posts.filter(
        post => post.topics && post.topics.includes(topic.name)
      ).length;
      
      if (postsUsingTopic > 0) {
        throw new Error(`Cannot delete: ${postsUsingTopic} posts are using this topic`);
      }
      
      // Delete the topic
      const result = await collections.topics.deleteOne({ _id: id });
      
      if (result.deletedCount === 0) {
        throw new Error('Topic not found');
      }
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting topic ${id}:`, error);
      throw error;
    }
  }
};

// Comments API
export const commentsApi = {
  getByPostId: async (postId: string): Promise<Comment[]> => {
    try {
      const { collections } = await connectToDatabase();
      const comments = await collections.comments
        .find()
        .toArray();
      const filteredComments = comments.filter(comment => comment.postId === postId);
      return formatMongoData(filteredComments);
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  },
  
  create: async (postId: string, comment: Omit<Comment, 'id'>): Promise<Comment> => {
    try {
      const { collections } = await connectToDatabase();
      
      const commentWithPostId = {
        ...comment,
        postId,
        date: comment.date || new Date().toISOString()
      };
      
      const result = await collections.comments.insertOne(commentWithPostId);
      
      // Update post comment count
      await collections.posts.updateOne(
        { _id: postId },
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
      const { collections } = await connectToDatabase();
      
      const replyWithDate = {
        ...reply,
        date: reply.date || new Date().toISOString()
      };
      
      await collections.comments.updateOne(
        { _id: commentId },
        { $push: { replies: replyWithDate } }
      );
      
      const updatedComment = await collections.comments.findOne({ _id: commentId });
      if (!updatedComment) throw new Error('Comment not found after update');
      return formatMongoData(updatedComment);
    } catch (error) {
      console.error(`Error adding reply to comment ${commentId}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      const { collections } = await connectToDatabase();
      
      const comment = await collections.comments.findOne({ _id: id });
      if (!comment) {
        throw new Error('Comment not found');
      }
      
      // Delete the comment
      const result = await collections.comments.deleteOne({ _id: id });
      
      if (result.deletedCount === 0) {
        throw new Error('Comment not found');
      }
      
      // Update post comment count
      if (comment.postId) {
        await collections.posts.updateOne(
          { _id: comment.postId },
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
