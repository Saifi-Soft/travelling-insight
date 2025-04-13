import { Post, Topic, Category } from '@/types/common';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Mock data for the blog
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "The Hidden Beaches of Thailand You Need to Visit",
    excerpt: "Discover untouched paradises away from the tourist crowds where crystal clear waters meet pristine white sand.",
    author: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    category: "Beaches",
    coverImage: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: "May 15, 2025",
    readTime: "8 min read",
    likes: 342,
    comments: 56,
    topics: ["Thailand", "Beaches", "Travel Tips"]
  },
  {
    id: "2",
    title: "A Foodie's Guide to Authentic Italian Cuisine",
    excerpt: "Beyond pizza and pasta: regional specialties that will transform your understanding of Italian food.",
    author: {
      name: "Marco Rossi",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    category: "Food & Drink",
    coverImage: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: "April 28, 2025",
    readTime: "12 min read",
    likes: 215,
    comments: 42
  },
  {
    id: "3",
    title: "Exploring Japan's Ancient Temples and Modern Cities",
    excerpt: "A journey through time in the Land of the Rising Sun, where tradition and innovation coexist in harmony.",
    author: {
      name: "Emma Chen",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    category: "Culture",
    coverImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: "June 3, 2025",
    readTime: "15 min read",
    likes: 421,
    comments: 83
  },
  {
    id: "4",
    title: "Ultimate Guide to Backpacking Through Southeast Asia",
    excerpt: "Everything you need to know about planning your adventure, from budgeting to must-visit destinations.",
    author: {
      name: "Alex Morgan",
      avatar: "https://i.pravatar.cc/150?img=7"
    },
    category: "Budget",
    coverImage: "https://images.unsplash.com/photo-1512453979780-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: "May 22, 2025",
    readTime: "20 min read",
    likes: 287,
    comments: 49
  },
  {
    id: "5",
    title: "How to Find Authentic Experiences in Tourist Destinations",
    excerpt: "Tips and strategies for going beyond the guidebook and connecting with local cultures.",
    author: {
      name: "Priya Sharma",
      avatar: "https://i.pravatar.cc/150?img=9"
    },
    category: "Culture",
    coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    date: "April 10, 2025",
    readTime: "10 min read",
    likes: 194,
    comments: 31
  },
  {
    id: "6",
    title: "The Rise of Eco-Tourism: Sustainable Travel Practices",
    excerpt: "How travelers can reduce their carbon footprint while exploring the world's natural wonders.",
    author: {
      name: "Daniel Green",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    category: "Sustainable",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: "June 15, 2025",
    readTime: "12 min read",
    likes: 312,
    comments: 47
  }
];

const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Beaches", slug: "beaches", icon: "🏖️", count: 12, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
  { id: "2", name: "Mountains", slug: "mountains", icon: "🏔️", count: 8, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" },
  { id: "3", name: "Urban", slug: "urban", icon: "🏙️", count: 15, image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df" },
  { id: "4", name: "Food & Drink", slug: "food-drink", icon: "🍴", count: 20, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0" },
  { id: "5", name: "Culture", slug: "culture", icon: "🏛️", count: 13, image: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580" },
  { id: "6", name: "Budget", slug: "budget", icon: "💰", count: 7, image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8" },
  { id: "7", name: "Sustainable", slug: "sustainable", icon: "♻️", count: 9, image: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5" },
  { id: "8", name: "Adventure", slug: "adventure", icon: "🧗", count: 18, image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f" }
];

const MOCK_TOPICS: Topic[] = [
  { id: "1", name: "Backpacking", slug: "backpacking", count: 24 },
  { id: "2", name: "Road Trips", slug: "road-trips", count: 19 },
  { id: "3", name: "Solo Travel", slug: "solo-travel", count: 15 },
  { id: "4", name: "Family Vacation", slug: "family-vacation", count: 12 },
  { id: "5", name: "Photography", slug: "photography", count: 28 },
  { id: "6", name: "Digital Nomad", slug: "digital-nomad", count: 13 },
  { id: "7", name: "Luxury Travel", slug: "luxury-travel", count: 9 },
  { id: "8", name: "Budget Travel", slug: "budget-travel", count: 17 }
];

// Shared in-memory store for mock data
let posts = [...MOCK_POSTS];
let categories = [...MOCK_CATEGORIES];
let topics = [...MOCK_TOPICS];

// Generic fetch function with error handling and mock data fallback
async function fetchAPI<T>(endpoint: string, options?: RequestInit, mockData?: T): Promise<T> {
  if (!API_URL || API_URL.includes('localhost')) {
    // Return mock data if API_URL not set or is localhost
    if (mockData) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData as T;
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch data');
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    
    // Return mock data as fallback if provided
    if (mockData) return mockData as T;
    
    // Re-throw the error if no mock data provided
    throw error;
  }
}

// Posts API
export const postsApi = {
  getAll: () => fetchAPI<Post[]>('/posts', undefined, posts),
  
  getById: (id: string) => {
    const post = posts.find(post => post.id === id);
    return fetchAPI<Post>(`/posts/${id}`, undefined, post as Post);
  },
  
  getFeatured: () => {
    // Return first 3 posts as featured
    const featured = posts.slice(0, 3);
    return fetchAPI<Post[]>('/posts/featured', undefined, featured);
  },
  
  getTrending: () => {
    // Return posts sorted by likes for trending
    const trending = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 4);
    return fetchAPI<Post[]>('/posts/trending', undefined, trending);
  },
  
  getByCategory: (category: string) => {
    const filtered = posts.filter(post => post.category.toLowerCase() === category.toLowerCase());
    return fetchAPI<Post[]>(`/posts/category/${category}`, undefined, filtered);
  },
  
  getByTag: (tag: string) => {
    // Use optional chaining to safely access topics property
    const filtered = posts.filter(post => post.topics?.includes(tag));
    return fetchAPI<Post[]>(`/posts/tag/${tag}`, undefined, filtered);
  },
  
  // Admin operations
  create: async (post: Omit<Post, 'id'>) => {
    const newPost = {
      ...post,
      id: Date.now().toString(),
    };
    
    try {
      const result = await fetchAPI<Post>(
        '/posts',
        { method: 'POST', body: JSON.stringify(newPost) },
        newPost
      );
      
      // Update local posts array for mock data
      posts = [...posts, newPost];
      
      return result;
    } catch (error) {
      throw error;
    }
  },
  
  update: async (id: string, post: Partial<Post>) => {
    try {
      // Find and update the post in our mock data
      const index = posts.findIndex(p => p.id === id);
      if (index !== -1) {
        const updatedPost = { ...posts[index], ...post };
        posts[index] = updatedPost;
        
        return fetchAPI<Post>(
          `/posts/${id}`,
          { method: 'PUT', body: JSON.stringify(post) },
          updatedPost
        );
      }
      
      throw new Error('Post not found');
    } catch (error) {
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      // Filter out the post from our mock data
      const previousLength = posts.length;
      posts = posts.filter(post => post.id !== id);
      
      if (posts.length === previousLength) {
        throw new Error('Post not found');
      }
      
      return fetchAPI<{ success: boolean }>(
        `/posts/${id}`,
        { method: 'DELETE' },
        { success: true }
      );
    } catch (error) {
      throw error;
    }
  },
};

// Categories API
export const categoriesApi = {
  getAll: () => fetchAPI<Category[]>('/categories', undefined, categories),
  
  getById: (id: string) => {
    const category = categories.find(cat => cat.id === id);
    return fetchAPI<Category>(`/categories/${id}`, undefined, category as Category);
  },
  
  // Admin operations
  create: async (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(), 
      count: 0
    };
    
    try {
      const result = await fetchAPI<Category>(
        '/categories',
        { method: 'POST', body: JSON.stringify(newCategory) },
        newCategory
      );
      
      // Update local categories array
      categories = [...categories, newCategory];
      
      return result;
    } catch (error) {
      throw error;
    }
  },
  
  update: async (id: string, category: Partial<Category>) => {
    try {
      // Find and update the category in our mock data
      const index = categories.findIndex(c => c.id === id);
      if (index !== -1) {
        const updatedCategory = { ...categories[index], ...category };
        categories[index] = updatedCategory;
        
        return fetchAPI<Category>(
          `/categories/${id}`,
          { method: 'PUT', body: JSON.stringify(category) },
          updatedCategory
        );
      }
      
      throw new Error('Category not found');
    } catch (error) {
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      // Filter out the category from our mock data
      const previousLength = categories.length;
      categories = categories.filter(category => category.id !== id);
      
      if (categories.length === previousLength) {
        throw new Error('Category not found');
      }
      
      return fetchAPI<{ success: boolean }>(
        `/categories/${id}`,
        { method: 'DELETE' },
        { success: true }
      );
    } catch (error) {
      throw error;
    }
  },
};

// Topics/Tags API
export const topicsApi = {
  getAll: () => fetchAPI<Topic[]>('/topics', undefined, topics),
  
  getTrending: () => {
    // Return topics sorted by count for trending
    const trending = [...topics].sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 5);
    return fetchAPI<Topic[]>('/topics/trending', undefined, trending);
  },
  
  // Admin operations
  create: async (topic: Omit<Topic, 'id'>) => {
    const newTopic = {
      ...topic,
      id: Date.now().toString(),
      count: 0
    };
    
    try {
      const result = await fetchAPI<Topic>(
        '/topics',
        { method: 'POST', body: JSON.stringify(newTopic) },
        newTopic
      );
      
      // Update local topics array
      topics = [...topics, newTopic];
      
      return result;
    } catch (error) {
      throw error;
    }
  },
  
  update: async (id: string, topic: Partial<Topic>) => {
    try {
      // Find and update the topic in our mock data
      const index = topics.findIndex(t => t.id === id);
      if (index !== -1) {
        const updatedTopic = { ...topics[index], ...topic };
        topics[index] = updatedTopic;
        
        return fetchAPI<Topic>(
          `/topics/${id}`,
          { method: 'PUT', body: JSON.stringify(topic) },
          updatedTopic
        );
      }
      
      throw new Error('Topic not found');
    } catch (error) {
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      // Filter out the topic from our mock data
      const previousLength = topics.length;
      topics = topics.filter(topic => topic.id !== id);
      
      if (topics.length === previousLength) {
        throw new Error('Topic not found');
      }
      
      return fetchAPI<{ success: boolean }>(
        `/topics/${id}`,
        { method: 'DELETE' },
        { success: true }
      );
    } catch (error) {
      throw error;
    }
  },
};
