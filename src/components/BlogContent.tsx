import { Post } from '@/types/common';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import BlogTabs from '@/components/blog/BlogTabs';

interface BlogContentProps {
  filteredPosts: Post[];
}

const BlogContent = ({ filteredPosts }: BlogContentProps) => {
  const tabs = [
    {
      id: "grid",
      label: "Grid",
      content: (
        <>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
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
          {filteredPosts.length > 0 ? (
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} variant="horizontal" />
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
      <div className="mt-12 text-center">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
          Load More
        </Button>
      </div>
    </div>
  );
};

export default BlogContent;