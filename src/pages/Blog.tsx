
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogHeader from '@/components/BlogHeader';
import BlogContent from '@/components/BlogContent';
import { postsApi, categoriesApi } from '@/api/apiService';

// Sample categories for filtering
const DEFAULT_CATEGORIES = ["All", "Beaches", "Mountains", "Urban", "Food & Drink", "Culture", "Budget", "Sustainable", "Adventure"];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch posts using react-query
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: postsApi.getAll,
  });
  
  // Fetch categories using react-query
  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });
  
  // Transform categories data to include "All" as first option
  const categories = ["All", ...categoriesData.map(category => category.name)];
  
  // Filter posts based on category and search query
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <BlogHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories.length > 1 ? categories : DEFAULT_CATEGORIES}
        />
        
        <BlogContent 
          filteredPosts={filteredPosts} 
          isLoading={postsLoading} 
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
