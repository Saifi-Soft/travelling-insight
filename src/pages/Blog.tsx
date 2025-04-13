
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogHeader from '@/components/BlogHeader';
import BlogContent from '@/components/BlogContent';
import HeaderAd from '@/components/ads/HeaderAd';
import FooterAd from '@/components/ads/FooterAd';
import SidebarAd from '@/components/ads/SidebarAd';
import { Loader2 } from 'lucide-react';
import { Post, Category, Topic } from '@/types/common';
import { toast } from 'sonner';

// Import the mongoApiService for direct query access
import { mongoApiService } from '@/api/mongoApiService';

// Define wrapper functions to match the expected types
const postsApi = {
  getAll: async (): Promise<Post[]> => {
    return await mongoApiService.queryDocuments('posts', {});
  },
  
  getTrending: async (): Promise<Post[]> => {
    const posts = await mongoApiService.queryDocuments('posts', {});
    // Sort posts by likes to get trending
    return posts.sort((a: Post, b: Post) => b.likes - a.likes).slice(0, 10);
  },
  
  getByCategory: async (categorySlug: string): Promise<Post[]> => {
    try {
      const categories = await mongoApiService.queryDocuments('categories', {});
      const category = categories.find((cat: Category) => cat.slug === categorySlug);
      
      if (!category) {
        throw new Error(`Category with slug ${categorySlug} not found`);
      }
      
      const posts = await mongoApiService.queryDocuments('posts', {
        category: category.name
      });
      
      return posts;
    } catch (error) {
      console.error(`Error fetching posts for category ${categorySlug}:`, error);
      toast.error("Couldn't load category posts");
      return [];
    }
  },
  
  getByTag: async (tagSlug: string): Promise<Post[]> => {
    try {
      const topics = await mongoApiService.queryDocuments('topics', {});
      const topic = topics.find((t: Topic) => t.slug === tagSlug);
      
      if (!topic) {
        throw new Error(`Topic with slug ${tagSlug} not found`);
      }
      
      const posts = await mongoApiService.queryDocuments('posts', {});
      return posts.filter((post: Post) => post.topics && post.topics.includes(topic.name));
    } catch (error) {
      console.error(`Error fetching posts for tag ${tagSlug}:`, error);
      toast.error("Couldn't load tag posts");
      return [];
    }
  }
};

const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    return await mongoApiService.queryDocuments('categories', {});
  }
};

const topicsApi = {
  getTrending: async (): Promise<Topic[]> => {
    return await mongoApiService.queryDocuments('topics', {});
  }
};

const Blog = () => {
  const [searchParams] = useSearchParams();
  const isTrending = searchParams.get("trending") === "true";
  const categorySlug = searchParams.get("category");
  const tagSlug = searchParams.get("tag");
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Determine which API call to make based on search parameters
  const fetchPosts = async () => {
    if (categorySlug) {
      return postsApi.getByCategory(categorySlug);
    } else if (tagSlug) {
      return postsApi.getByTag(tagSlug);
    } else if (isTrending) {
      return postsApi.getTrending();
    } else {
      return postsApi.getAll();
    }
  };
  
  // Fetch posts using react-query
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['posts', isTrending, categorySlug, tagSlug],
    queryFn: fetchPosts,
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
  
  // Set page title based on parameters
  useEffect(() => {
    if (categorySlug) {
      const category = categoriesData.find((c: Category) => c.slug === categorySlug);
      document.title = category ? `${category.name} - Travel Blog` : "Travel Blog";
    } else if (tagSlug) {
      const tag = trendingTopics.find((t: Topic) => t.slug === tagSlug);
      document.title = tag ? `#${tag.name} - Travel Blog` : "Travel Blog";
    } else if (isTrending) {
      document.title = "Trending Articles - Travel Blog";
    } else {
      document.title = "Blog - Travel Blog";
    }
  }, [isTrending, categorySlug, tagSlug, categoriesData, trendingTopics]);
  
  // Transform categories data to include "All" as first option
  const categories = ["All", ...(categoriesData as Category[]).map(category => category.name)];
  
  // Filter posts based on category and search query
  const filteredPosts = (posts as Post[]).filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isLoading = postsLoading || categoriesLoading || topicsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-custom-green mx-auto" />
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
        
        <div className="container mx-auto px-4 mt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="w-full lg:w-2/3">
              <BlogContent 
                filteredPosts={filteredPosts} 
                isLoading={isLoading}
              />
            </div>
            
            {/* Sidebar for ad */}
            <div className="w-full lg:w-1/3 space-y-8">
              <div className="sticky top-4">
                <SidebarAd />
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer ad at bottom of content */}
        <div className="container mx-auto px-4 my-12">
          <FooterAd />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
