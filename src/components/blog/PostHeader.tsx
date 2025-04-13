
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MessageSquare } from 'lucide-react';
import { Post } from '@/types/common';

interface PostHeaderProps {
  post: Post & { content?: string; tags?: string[] };
  commentCount: number;
}

const PostHeader = ({ post, commentCount }: PostHeaderProps) => {
  return (
    <div className="relative h-[40vh] md:h-[60vh]">
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <img 
        src={post.coverImage} 
        alt={post.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 text-white">
        <div className="container-custom">
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/90 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>{commentCount} comments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
