import { Post, Topic, Category } from '@/types/common';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
}

// Posts API
export const postsApi = {
  getAll: () => fetchAPI<Post[]>('/posts'),
  getById: (id: string) => fetchAPI<Post>(`/posts/${id}`),
  getFeatured: () => fetchAPI<Post[]>('/posts/featured'),
  getTrending: () => fetchAPI<Post[]>('/posts/trending'),
  getByCategory: (category: string) => fetchAPI<Post[]>(`/posts/category/${category}`),
  getByTag: (tag: string) => fetchAPI<Post[]>(`/posts/tag/${tag}`),
  
  // Admin operations
  create: (post: Omit<Post, 'id'>) => 
    fetchAPI<Post>('/posts', { method: 'POST', body: JSON.stringify(post) }),
  update: (id: string, post: Partial<Post>) => 
    fetchAPI<Post>(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(post) }),
  delete: (id: string) => 
    fetchAPI<{ success: boolean }>(`/posts/${id}`, { method: 'DELETE' }),
};

// Categories API
export const categoriesApi = {
  getAll: () => fetchAPI<Category[]>('/categories'),
  getById: (id: string) => fetchAPI<Category>(`/categories/${id}`),
  
  // Admin operations
  create: (category: Omit<Category, 'id'>) => 
    fetchAPI<Category>('/categories', { method: 'POST', body: JSON.stringify(category) }),
  update: (id: string, category: Partial<Category>) => 
    fetchAPI<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(category) }),
  delete: (id: string) => 
    fetchAPI<{ success: boolean }>(`/categories/${id}`, { method: 'DELETE' }),
};

// Topics/Tags API
export const topicsApi = {
  getAll: () => fetchAPI<Topic[]>('/topics'),
  getTrending: () => fetchAPI<Topic[]>('/topics/trending'),
  
  // Admin operations
  create: (topic: Omit<Topic, 'id'>) => 
    fetchAPI<Topic>('/topics', { method: 'POST', body: JSON.stringify(topic) }),
  update: (id: string, topic: Partial<Topic>) => 
    fetchAPI<Topic>(`/topics/${id}`, { method: 'PUT', body: JSON.stringify(topic) }),
  delete: (id: string) => 
    fetchAPI<{ success: boolean }>(`/topics/${id}`, { method: 'DELETE' }),
};
