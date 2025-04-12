
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogHeader from '@/components/BlogHeader';
import BlogContent from '@/components/BlogContent';
import BetweenPostsAd from '@/components/ads/BetweenPostsAd';
import { postsApi, categoriesApi, topicsApi } from '@/api/mongoApiService';
import { Loader2 } from 'lucide-react';

const Blog = () => {
  const [searchParams] = useSearchParams();
  const isTrending = searchParams.get("trending") === "true";
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch posts using react-query
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: postsApi.getAll,
  });
  
  // Fetch trending posts if the trending parameter is set
  const { data: trendingPosts = [], isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-posts'],
    queryFn: postsApi.getTrending,
    enabled: isTrending,
  });
  
  // Fetch categories using react-query
  const { data: categoriesData = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  // Fetch trending topics/hashtags
  const { data: trendingTopics = [], isLoading: topicsLoading } = useQuery({
    queryKey: ['trending-topics'],
    queryFn: topicsApi.getTrending,
  });
  
  // Set page title based on trending filter
  useEffect(() => {
    document.title = isTrending ? "Trending Articles - Travel Blog" : "Blog - Travel Blog";
  }, [isTrending]);
  
  // Transform categories data to include "All" as first option
  const categories = ["All", ...categoriesData.map(category => category.name)];
  
  // Use trending posts if the trending parameter is set, otherwise use all posts
  const postsToDisplay = isTrending ? trendingPosts : posts;
  
  // Filter posts based on category and search query
  const filteredPosts = postsToDisplay.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isLoading = (isTrending ? trendingLoading : postsLoading) || categoriesLoading || topicsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-lg text-gray-600">Loading content...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <BlogHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories}
          isTrending={isTrending}
        />
        
        {/* Add an ad at the top of the content */}
        <div className="container mx-auto px-4">
          <BetweenPostsAd className="mt-6" />
        </div>
        
        <BlogContent 
          filteredPosts={filteredPosts} 
          isLoading={isLoading}
        />
        
        {/* Add another ad at the bottom of the content */}
        <div className="container mx-auto px-4">
          <BetweenPostsAd className="mb-6" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
