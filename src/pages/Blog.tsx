import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { mongoApiService } from '@/api/mongoApiService';
import { Post, Category, Topic } from '@/types/common';
import { Skeleton } from '@/components/ui/skeleton';
import { DbDocument } from '@/api/mongoDbService';
import PostCard from '@/components/PostCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Blog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // State for filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    queryParams.get('category')
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(
    queryParams.get('tag')
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    queryParams.get('search') || ''
  );
  
  // Fetch posts with the mongoApiService
  const { data: postsData, isLoading: isPostsLoading } = useQuery({
    queryKey: ['posts', selectedCategory, selectedTag, searchQuery],
    queryFn: async () => {
      try {
        let query = {};
        
        if (selectedCategory) {
          query = { category: selectedCategory };
        }
        
        if (selectedTag) {
          query = { ...query, topics: selectedTag };
        }
        
        const result = await mongoApiService.queryDocuments('posts', query);
        return result.map(doc => ({ ...doc } as Post));
      } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
      }
    }
  });
  
  // Fetch categories
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const result = await mongoApiService.queryDocuments('categories', {});
        return result.map(doc => ({ ...doc } as Category));
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    }
  });
  
  // Fetch topics
  const { data: topicsData, isLoading: isTopicsLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      try {
        const result = await mongoApiService.queryDocuments('topics', {});
        return result.map(doc => ({ ...doc } as Topic));
      } catch (error) {
        console.error('Error fetching topics:', error);
        return [];
      }
    }
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    
    if (selectedTag) {
      params.set('tag', selectedTag);
    }
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    const newUrl = `${location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(newUrl, { replace: true });
  }, [selectedCategory, selectedTag, searchQuery, navigate, location.pathname]);
  
  // Helper to handle category selection
  const handleCategorySelect = (categorySlug: string) => {
    if (selectedCategory === categorySlug) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categorySlug);
      setSelectedTag(null); // Reset tag when category changes
    }
  };
  
  // Helper to handle tag selection
  const handleTagSelect = (tagSlug: string) => {
    if (selectedTag === tagSlug) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tagSlug);
    }
  };
  
  // Handle search input
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search is already updated via the input onChange
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setSearchQuery('');
  };
  
  // Convert DbDocument to required types
  const posts = Array.isArray(postsData) ? postsData.map(doc => doc as Post) : [];
  const categories = Array.isArray(categoriesData) ? categoriesData.map(doc => doc as Category) : [];
  const topics = Array.isArray(topicsData) ? topicsData.map(doc => doc as Topic) : [];
  
  // Filter posts by search query
  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
      (post.content && post.content.toLowerCase().includes(query))
    );
  });
  
  // Get active filters count for mobile
  const activeFiltersCount = [selectedCategory, selectedTag, searchQuery].filter(Boolean).length;
  
  return (
    <div className="container-custom py-12">
      <div className="flex flex-col space-y-6">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Travel Blog</h1>
          <p className="text-muted-foreground">
            Explore our collection of travel stories, tips, and guides from around the world
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-8rem)] py-4">
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-medium mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {isCategoriesLoading ? (
                        Array(6).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-8 w-24" />
                        ))
                      ) : (
                        categories.map((category) => (
                          <Badge
                            key={category.id || category._id}
                            variant={selectedCategory === category.slug ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleCategorySelect(category.slug)}
                          >
                            {category.name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Topics/Tags */}
                  <div>
                    <h3 className="font-medium mb-3">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {isTopicsLoading ? (
                        Array(8).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-8 w-20" />
                        ))
                      ) : (
                        topics.map((topic) => (
                          <Badge
                            key={topic.id || topic._id}
                            variant={selectedTag === topic.slug ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => handleTagSelect(topic.slug)}
                          >
                            {topic.name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <Button onClick={clearFilters} variant="outline" className="w-full">
                    Clear All Filters
                  </Button>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          
          {/* Desktop sidebar */}
          <div className="hidden md:block w-64 space-y-6">
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {isCategoriesLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-24" />
                  ))
                ) : (
                  categories.map((category) => (
                    <Badge
                      key={category.id || category._id}
                      variant={selectedCategory === category.slug ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleCategorySelect(category.slug)}
                    >
                      {category.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {isTopicsLoading ? (
                  Array(8).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20" />
                  ))
                ) : (
                  topics.map((topic) => (
                    <Badge
                      key={topic.id || topic._id}
                      variant={selectedTag === topic.slug ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagSelect(topic.slug)}
                    >
                      {topic.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            
            {(selectedCategory || selectedTag || searchQuery) && (
              <>
                <Separator />
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  Clear All Filters
                </Button>
              </>
            )}
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10 pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </form>
            
            {/* Active filters */}
            {(selectedCategory || selectedTag) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory && categories.find(c => c.slug === selectedCategory) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {categories.find(c => c.slug === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory(null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {selectedTag && topics.find(t => t.slug === selectedTag) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Topic: {topics.find(t => t.slug === selectedTag)?.name}
                    <button onClick={() => setSelectedTag(null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
            
            {/* Posts grid */}
            {isPostsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id || post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-medium mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
