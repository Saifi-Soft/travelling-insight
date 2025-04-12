
import { Post } from '@/types/common';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import BlogTabs from '@/components/blog/BlogTabs';
import { Skeleton } from '@/components/ui/skeleton';

interface BlogContentProps {
  filteredPosts: Post[];
  isLoading?: boolean;
}

const BlogContent = ({ filteredPosts, isLoading = false }: BlogContentProps) => {
  // Create skeleton array for loading state
  const skeletons = Array(6).fill(0).map((_, i) => i);
  
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
              {filteredPosts.map(post => (
                <div key={post.id}>
                  <PostCard post={post} variant="default" />
                </div>
              ))}
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
              {filteredPosts.map(post => (
                <div key={post.id}>
                  <PostCard post={post} variant="horizontal" />
                </div>
              ))}
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
