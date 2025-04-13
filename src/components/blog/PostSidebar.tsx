
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/types/common';
import PostAuthor from './PostAuthor';

interface PostSidebarProps {
  author: { name: string; avatar: string };
  relatedPosts: Post[];
  popularTags: string[];
}

const PostSidebar = ({ author, relatedPosts, popularTags }: PostSidebarProps) => {
  return (
    <div className="lg:w-1/3">
      {/* Author Card */}
      <PostAuthor author={author} isSidebar={true} />
      
      {/* Related Articles */}
      <div className="mb-8 bg-card p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-6 text-custom-green">Related Articles</h3>
        <div className="space-y-6">
          {relatedPosts.map((relatedPost) => (
            <Link 
              to={`/blog/${relatedPost.id}`} 
              key={relatedPost.id}
              className="flex gap-4 group"
            >
              <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={relatedPost.coverImage} 
                  alt={relatedPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <h4 className="font-medium line-clamp-2 group-hover:text-custom-green transition-colors">
                  {relatedPost.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {relatedPost.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Popular Tags */}
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-6 text-custom-green">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link 
              to={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`} 
              key={tag}
            >
              <Badge 
                variant="tag" 
                className="text-sm py-1.5 px-3 cursor-pointer"
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostSidebar;
