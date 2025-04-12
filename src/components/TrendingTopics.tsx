
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, Globe, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { topicsApi, categoriesApi, postsApi } from '@/api/mongoApiService';
import { Skeleton } from '@/components/ui/skeleton';
import { Topic, Category, Post } from '@/types/common';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const TrendingTopics = () => {
  const { 
    data: trendingHashtags, 
    isLoading: isHashtagsLoading 
  } = useQuery({
    queryKey: ['trendingHashtags'],
    queryFn: topicsApi.getTrending,
    placeholderData: TRENDING_HASHTAGS,
  });

  const { 
    data: categories, 
    isLoading: isCategoriesLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    placeholderData: CATEGORIES,
  });

  const { 
    data: trendingArticles, 
    isLoading: isArticlesLoading 
  } = useQuery({
    queryKey: ['trendingArticles'],
    queryFn: postsApi.getTrending,
    placeholderData: TRENDING_ARTICLES,
  });

  // Track article clicks to determine trending status
  const trackArticleClick = async (articleId: string) => {
    try {
      // Increment click count in the database
      // This would typically update a 'clicks' or 'views' field for the article
      await postsApi.trackClick(articleId);
      
      // Invalidate the trending articles query to refresh the data
      // This would normally be handled by the QueryClient
      console.log(`Tracked click for article ${articleId}`);
    } catch (error) {
      console.error('Error tracking article click:', error);
    }
  };

  return (
    <section className="section">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Trending Hashtags */}
          <div>
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">Trending Hashtags</h2>
            </div>
            
            <Card className="overflow-hidden border-primary/10 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
              <CardContent className="p-6">
                {isHashtagsLoading ? (
                  <div className="flex flex-wrap gap-3">
                    {Array(8).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-24 rounded-full" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {trendingHashtags?.map((tag) => (
                      <Link to={`/tags/${tag.slug}`} key={tag.id}>
                        <Badge 
                          variant="outline" 
                          className="text-sm py-2 px-3 border-primary/30 hover:bg-primary/10 
                          transition-colors hover:border-primary/50 flex items-center gap-1.5"
                        >
                          <span className="text-primary font-medium">#{tag.name}</span>
                          <span className="ml-1.5 bg-primary/20 text-primary px-1.5 py-0.5 rounded-md text-xs">
                            {tag.count}
                          </span>
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Trending Articles */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Flame className="h-6 w-6 text-accent mr-2" />
                <h2 className="text-2xl font-bold">Trending Articles</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-primary flex items-center gap-1" asChild>
                <Link to="/blog?trending=true">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            
            <Card className="overflow-hidden border-accent/10 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
              <CardContent className="p-6 space-y-4">
                {isArticlesLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <Skeleton className="w-16 h-16 rounded-md" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))
                ) : (
                  trendingArticles?.slice(0, 3).map((article) => (
                    <Link 
                      to={`/blog/${article.id}`} 
                      key={article.id} 
                      className="flex gap-3 items-center hover:bg-muted/50 p-2 rounded-md transition-colors"
                      onClick={() => trackArticleClick(article.id)}
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={article.coverImage} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm line-clamp-2">{article.title}</h3>
                        <p className="text-xs text-muted-foreground">{article.likes}k reads • {article.date}</p>
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Categories Grid - Full Width */}
          <div className="md:col-span-2 mt-6">
            <div className="flex items-center mb-6">
              <Globe className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">Explore Categories</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {isCategoriesLoading ? (
                Array(8).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden h-full">
                    <Skeleton className="h-32 w-full" />
                    <CardContent className="p-4 flex flex-col items-center">
                      <Skeleton className="h-8 w-8 rounded-full mb-2" />
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                categories?.map((category) => (
                  <Link 
                    to={`/categories/${category.slug}`} 
                    key={category.id}
                    className="group"
                  >
                    <Card className="overflow-hidden border-primary/10 hover:border-primary/30 transition-colors h-full shadow-md">
                      <div className="h-32 overflow-hidden">
                        <img 
                          src={category.image}
                          alt={category.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {category.count} posts
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Fallback data
const TRENDING_HASHTAGS: Topic[] = [
  { id: "1", name: "SoloTravel", count: 1243, slug: "solo-travel" },
  { id: "2", name: "VanLife", count: 986, slug: "van-life" },
  { id: "3", name: "BudgetTravel", count: 879, slug: "budget-travel" },
  { id: "4", name: "DigitalNomad", count: 763, slug: "digital-nomad" },
  { id: "5", name: "AdventureTravel", count: 652, slug: "adventure-travel" },
  { id: "6", name: "SustainableTravel", count: 541, slug: "sustainable-travel" },
  { id: "7", name: "LuxuryTravel", count: 489, slug: "luxury-travel" },
  { id: "8", name: "BackpackingAsia", count: 432, slug: "backpacking-asia" },
];

const CATEGORIES: Category[] = [
  { 
    id: "1", 
    name: "Beaches", 
    icon: "🏖️", 
    count: 143, 
    slug: "beaches",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80"
  },
  { 
    id: "2", 
    name: "Mountains", 
    icon: "🏔️", 
    count: 128, 
    slug: "mountains",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  { 
    id: "3", 
    name: "Urban", 
    icon: "🏙️", 
    count: 112, 
    slug: "urban",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1244&q=80"
  },
  { 
    id: "4", 
    name: "Food & Drink", 
    icon: "🍽️", 
    count: 98, 
    slug: "food-drink",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  { 
    id: "5", 
    name: "Culture", 
    icon: "🏛️", 
    count: 86, 
    slug: "culture",
    image: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
  },
  { 
    id: "6", 
    name: "Nature", 
    icon: "🌳", 
    count: 75, 
    slug: "nature",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"
  },
  { 
    id: "7", 
    name: "Adventure", 
    icon: "🧗", 
    count: 62, 
    slug: "adventure",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  { 
    id: "8", 
    name: "Budget", 
    icon: "💰", 
    count: 54, 
    slug: "budget",
    image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
  },
];

const TRENDING_ARTICLES: Post[] = [
  {
    id: "1",
    title: "Top 10 Mountain Views That Will Take Your Breath Away",
    excerpt: "Discover the most breathtaking mountain panoramas around the world.",
    author: {
      name: "Alex Morgan",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    category: "Mountains",
    coverImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    likes: 3200,
    date: "2 days ago",
    readTime: "8 min read",
    comments: 56
  },
  {
    id: "2",
    title: "Street Food Adventures: Eat Like a Local in Southeast Asia",
    excerpt: "Explore the vibrant street food scene across Southeast Asian countries.",
    author: {
      name: "Lisa Wong",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    category: "Food & Drink",
    coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    likes: 2700,
    date: "5 days ago",
    readTime: "6 min read",
    comments: 34
  },
  {
    id: "3",
    title: "Wildlife Photography: Tips for Capturing Animals in Their Natural Habitat",
    excerpt: "Professional tips to improve your wildlife photography skills.",
    author: {
      name: "James Wilson",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    category: "Photography",
    coverImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    likes: 1900,
    date: "1 week ago",
    readTime: "5 min read",
    comments: 21
  },
];

export default TrendingTopics;
