
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Heart, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/api/apiService';
import { Post } from '@/types/common';
import { Skeleton } from '@/components/ui/skeleton';

// Fallback data in case API fails
const FEATURED_POSTS: Post[] = [
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
    comments: 56
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
  }
];

const FeaturedPosts = () => {
  const { data: featuredPosts, isLoading } = useQuery({
    queryKey: ['featuredPosts'],
    queryFn: postsApi.getFeatured,
    placeholderData: FEATURED_POSTS,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
    refetchOnWindowFocus: false
  });

  // Always have data to render, use placeholder data before real data loads
  const postsToDisplay = featuredPosts || FEATURED_POSTS;
  
  // Helper functions to get author data
  const getAuthorName = (post: Post) => {
    if (typeof post.author === 'string') {
      return post.author;
    } else if (post.author && typeof post.author === 'object') {
      return post.author.name;
    }
    return 'Unknown Author';
  };

  const getAuthorAvatar = (post: Post) => {
    if (typeof post.author === 'object' && post.author && post.author.avatar) {
      return post.author.avatar;
    }
    return 'https://via.placeholder.com/40x40?text=Author';
  };

  return (
    <section className="py-16 bg-gradient-to-b from-theme-primary/10 to-background">
      <div className="container-custom">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="bg-theme-primary/20 text-theme-primary px-4 py-1 rounded-full text-sm font-medium mb-3">Discover</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">Featured Articles</h2>
          <p className="text-muted-foreground max-w-2xl">
            Explore our handpicked selection of inspiring travel stories, guides, and adventures from around the world
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loader while fetching data
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-lg h-full card-hover bg-theme-card">
                <div className="h-60">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="pt-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center space-x-3 mb-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <div className="flex items-center justify-between w-full">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            postsToDisplay.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="group">
                <Card className="overflow-hidden border-none shadow-lg h-full card-hover bg-theme-card">
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-theme-primary text-white text-xs font-medium px-3 py-1.5 rounded-full">
                      {post.category && (typeof post.category === 'object' ? post.category.name : post.category)}
                    </div>
                  </div>
                  
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold line-clamp-2 mb-2 group-hover:text-theme-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <img 
                        src={getAuthorAvatar(post)} 
                        alt={getAuthorName(post)}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-theme-primary/20"
                      />
                      <div>
                        <p className="text-sm font-medium">{getAuthorName(post)}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t border-border pt-4 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-theme-primary" />
                        <span>{post.date} • {post.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4 text-theme-primary" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4 text-theme-primary" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/blog">
            <Button variant="outline" className="border-theme-primary text-theme-primary hover:bg-theme-primary/10 group flex items-center">
              <span>View All Articles</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
