
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, MessageSquare, Heart, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostHeaderProps {
  title: string;
  excerpt?: string;
  author: {
    name: string;
    avatar?: string;
  } | string;
  category?: string | {
    id: string;
    name: string;
    slug: string;
  };
  date: string;
  readTime?: string;
  likes: number;
  comments: number;
  topics?: string[];
  className?: string;
}

const PostHeader = ({
  title,
  excerpt,
  author,
  category,
  date,
  readTime,
  likes,
  comments,
  topics,
  className
}: PostHeaderProps) => {
  // Helper function to get author display
  const getAuthorName = () => {
    if (typeof author === 'string') {
      return author;
    }
    return author.name;
  };

  const getAuthorAvatar = () => {
    if (typeof author === 'object' && author.avatar) {
      return author.avatar;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(getAuthorName())}`;
  };

  // Helper function to get category display
  const getCategoryDisplay = () => {
    if (!category) return 'Uncategorized';
    if (typeof category === 'string') return category;
    return category.name;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {category && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize bg-primary/10 hover:bg-primary/20">
            {getCategoryDisplay()}
          </Badge>
        </div>
      )}

      <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
        {title}
      </h1>

      {excerpt && (
        <p className="text-xl text-muted-foreground">
          {excerpt}
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-muted-foreground pt-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getAuthorAvatar()} alt={getAuthorName()} />
            <AvatarFallback>{getAuthorName().charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-foreground">{getAuthorName()}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center">
            <CalendarIcon className="mr-1 h-4 w-4" />
            <span>{date}</span>
          </div>

          {readTime && (
            <>
              <div className="hidden sm:block text-muted-foreground">•</div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{readTime}</span>
              </div>
            </>
          )}

          <div className="hidden sm:block text-muted-foreground">•</div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Heart className="mr-1 h-4 w-4 text-red-500" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="mr-1 h-4 w-4 text-primary" />
              <span>{comments}</span>
            </div>
          </div>
        </div>
      </div>

      {topics && topics.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {topics.map((topic, i) => (
            <Link to={`/blog/topic/${topic}`} key={i}>
              <Badge variant="secondary" className="flex items-center hover:bg-secondary/80 cursor-pointer">
                <Tag className="h-3 w-3 mr-1" />
                {topic}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostHeader;
