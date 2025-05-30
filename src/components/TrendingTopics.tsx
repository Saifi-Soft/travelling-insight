
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, Globe, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Topic, Category, Post } from '@/types/common';
import { Button } from '@/components/ui/button';
import { mongoApiService } from '@/api/mongoApiService';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { DbDocument } from '@/api/mongoDbService';

const topicsApi = {
  getTrending: async (): Promise<Topic[]> => {
    try {
      console.log('Fetching trending topics...');
      const topics = await mongoApiService.queryDocuments('topics', {});
      // Filter topics that have associated posts
      const posts = await mongoApiService.queryDocuments('posts', {});
      
      const topicsWithPosts = topics.filter(topic => {
        return posts.some(post => post.topics && post.topics.includes(topic.name));
      });
      
      console.log('Fetched topics with posts:', topicsWithPosts);
      return topicsWithPosts as Topic[];
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      return [];
    }
  }
};

const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      console.log('Fetching categories...');
      const categories = await mongoApiService.queryDocuments('categories', {});
      // Filter categories that have associated posts
      const posts = await mongoApiService.queryDocuments('posts', {});
      
      const categoriesWithPosts = categories.filter(category => {
        return posts.some(post => post.category === category.name);
      });
      
      console.log('Fetched categories with posts:', categoriesWithPosts);
      return categoriesWithPosts as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
};

const postsApi = {
  getTrending: async (): Promise<Post[]> => {
    try {
      console.log('Fetching trending posts...');
      const posts = await mongoApiService.queryDocuments('posts', {});
      console.log('Fetched posts:', posts);
      return posts as Post[];
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      return [];
    }
  },
  trackClick: async (id: string): Promise<void> => {
    try {
      const post = await mongoApiService.getDocumentById('posts', id);
      if (post) {
        await mongoApiService.updateDocument('posts', id, { clicks: (post.clicks || 0) + 1 });
      }
    } catch (error) {
      console.error('Error tracking article click:', error);
    }
  }
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
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  { 
    id: "2", 
    name: "Mountains", 
    icon: "🏔️", 
    count: 128, 
    slug: "mountains",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  { 
    id: "3", 
    name: "Urban", 
    icon: "🏙️", 
    count: 112, 
    slug: "urban",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df"
  },
  { 
    id: "4", 
    name: "Food & Drink", 
    icon: "🍽️", 
    count: 98, 
    slug: "food-drink",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
  },
  { 
    id: "5", 
    name: "Culture", 
    icon: "🏛️", 
    count: 86, 
    slug: "culture",
    image: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580"
  },
  { 
    id: "6", 
    name: "Nature", 
    icon: "🌳", 
    count: 75, 
    slug: "nature",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
  },
  { 
    id: "7", 
    name: "Adventure", 
    icon: "🧗", 
    count: 62, 
    slug: "adventure",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f"
  },
  { 
    id: "8", 
    name: "Budget", 
    icon: "💰", 
    count: 54, 
    slug: "budget",
    image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8"
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
    coverImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
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
    coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
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
    coverImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06",
    likes: 1900,
    date: "1 week ago",
    readTime: "5 min read",
    comments: 21
  },
];

const TrendingTopics = () => {
  const { 
    data: trendingHashtags, 
    isLoading: isHashtagsLoading 
  } = useQuery({
    queryKey: ['trendingHashtags'],
    queryFn: topicsApi.getTrending,
    placeholderData: TRENDING_HASHTAGS,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    retry: 3
  });

  const { 
    data: categories, 
    isLoading: isCategoriesLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    placeholderData: CATEGORIES,
    staleTime: 1000 * 60 * 15, // 15 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
    retry: 3
  });

  const { 
    data: trendingArticles, 
    isLoading: isArticlesLoading 
  } = useQuery({
    queryKey: ['trendingArticles'],
    queryFn: postsApi.getTrending,
    placeholderData: TRENDING_ARTICLES,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    retry: 3
  });

  const trackArticleClick = async (articleId: string) => {
    try {
      await postsApi.trackClick(articleId);
      console.log(`Tracked click for article ${articleId}`);
    } catch (error) {
      console.error('Error tracking article click:', error);
    }
  };

  const handleBadgeClick = (tag: Topic) => {
    if (!tag.slug) {
      toast.error("This topic doesn't have associated content yet");
      return;
    }
  };

  const handleCategoryClick = (category: Category) => {
    if (!category.slug) {
      toast.error("This category doesn't have associated content yet");
      return;
    }
  };

  // Setup initial data to avoid layout shifts
  const displayHashtags = trendingHashtags || TRENDING_HASHTAGS;
  const displayCategories = categories || CATEGORIES;
  const displayArticles = trendingArticles || TRENDING_ARTICLES;

  return (
    <section className="section">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-theme-primary mr-2" />
              <h2 className="text-2xl font-bold text-theme-primary">Trending Hashtags</h2>
            </div>
            
            <Card className="overflow-hidden border-theme-primary/10 shadow-lg bg-theme-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                {isHashtagsLoading ? (
                  <div className="flex flex-wrap gap-3">
                    {Array(8).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-24 rounded-full" />
                    ))}
                  </div>
                ) : displayHashtags && displayHashtags.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {displayHashtags.map((tag) => (
                      <Link 
                        to={`/blog?tag=${tag.slug}`} 
                        key={tag.id}
                        onClick={() => handleBadgeClick(tag)}
                      >
                        <Badge 
                          variant="outline" 
                          className="text-sm py-2 px-3 border-theme-primary/30 hover:bg-theme-primary/10 
                          transition-colors hover:border-theme-primary/50 flex items-center gap-1.5"
                        >
                          <span className="text-theme-primary font-medium">#{tag.name}</span>
                          <span className="ml-1.5 bg-theme-primary/20 text-theme-primary px-1.5 py-0.5 rounded-md text-xs">
                            {tag.count}
                          </span>
                        </Badge>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-muted-foreground">No hashtags available</div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Flame className="h-6 w-6 text-theme-primary mr-2" />
                <h2 className="text-2xl font-bold text-theme-primary">Trending Articles</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-theme-primary flex items-center gap-1" asChild>
                <Link to="/blog?trending=true">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            
            <Card className="overflow-hidden border-theme-primary/10 shadow-lg bg-theme-card/80 backdrop-blur-sm">
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
                ) : displayArticles && displayArticles.length > 0 ? (
                  displayArticles.slice(0, 3).map((article) => (
                    <Link 
                      to={`/blog/${article.id}`} 
                      key={article.id}
                      className="flex gap-4 group hover:bg-muted/50 p-2 rounded-md transition-colors"
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
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-theme-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {article.likes}k reads • {article.date}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-4 text-center text-muted-foreground">No articles available</div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 mt-6">
            <div className="flex items-center mb-6">
              <Globe className="h-6 w-6 text-theme-primary mr-2" />
              <h2 className="text-2xl font-bold text-theme-primary">Explore Categories</h2>
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
              ) : displayCategories && displayCategories.length > 0 ? (
                displayCategories.map((category) => (
                  <Link 
                    to={`/blog?category=${category.slug}`} 
                    key={category.id}
                    className="group"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <Card className="overflow-hidden border-theme-primary/10 hover:border-theme-primary/30 transition-colors h-full shadow-md">
                      <div className="h-32 overflow-hidden">
                        <img 
                          src={category.image}
                          alt={category.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <h3 className="font-medium group-hover:text-theme-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {category.count} posts
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="md:col-span-4 py-8 text-center text-muted-foreground">No categories available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingTopics;
