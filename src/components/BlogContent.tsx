
import { Post } from '@/types/common';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import BlogTabs from '@/components/blog/BlogTabs';
import { Skeleton } from '@/components/ui/skeleton';
import BetweenPostsAd from '@/components/ads/BetweenPostsAd';

interface BlogContentProps {
  filteredPosts: Post[];
  isLoading?: boolean;
}

const BlogContent = ({ filteredPosts, isLoading = false }: BlogContentProps) => {
  // Create skeleton array for loading state
  const skeletons = Array(6).fill(0).map((_, i) => i);
  
  // Function to insert ads between posts
  const renderPostsWithAds = (posts: Post[], variant: 'grid' | 'list') => {
    const postsWithAds = [];
    const adFrequency = 3; // Show an ad after every 3 posts
    
    for (let i = 0; i < posts.length; i++) {
      // Add the post
      postsWithAds.push(
        <div key={posts[i].id}>
          <PostCard post={posts[i]} variant={variant === 'list' ? 'horizontal' : 'default'} />
        </div>
      );
      
      // Add an ad after every adFrequency posts (except at the end)
      if ((i + 1) % adFrequency === 0 && i < posts.length - 1) {
        postsWithAds.push(
          <BetweenPostsAd key={`ad-${i}`} className={variant === 'list' ? 'my-8' : ''} />
        );
      }
    }
    
    return postsWithAds;
  };
  
  const tabs = [
    {
      id: "grid",
      label: "Grid",
      content: (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skeletons.map((index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-60 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderPostsWithAds(filteredPosts, 'grid')}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No articles matching your criteria.
              </p>
            </div>
          )}
        </>
      )
    },
    {
      id: "list",
      label: "List",
      content: (
        <>
          {isLoading ? (
            <div className="space-y-8">
              {skeletons.map((index) => (
                <div key={index} className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="h-60 w-full md:w-1/3" />
                  <div className="md:w-2/3 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="space-y-8">
              {renderPostsWithAds(filteredPosts, 'list')}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No articles matching your criteria.
              </p>
            </div>
          )}
        </>
      )
    }
  ];

  return (
    <div className="container-custom py-8">
      {/* Tabs for different views */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">All Articles</h2>
        </div>
        
        <BlogTabs tabs={tabs} defaultTab="grid" className="mt-6" />
      </div>
      
      {/* Load More */}
      {filteredPosts.length > 0 && !isLoading && (
        <div className="mt-12 text-center">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogContent;
