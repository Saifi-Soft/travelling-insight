
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Heart } from 'lucide-react';
import { Post, Author } from '@/types/common';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'horizontal';
}

const PostCard = ({ post, variant = 'default' }: PostCardProps) => {
  // Helper function to get author info
  const getAuthorName = () => {
    if (typeof post.author === 'string') {
      return post.author;
    } else if (post.author && typeof post.author === 'object') {
      return post.author.name;
    }
    return 'Unknown Author';
  };

  const getAuthorAvatar = () => {
    if (typeof post.author === 'object' && post.author && post.author.avatar) {
      return post.author.avatar;
    }
    return 'https://via.placeholder.com/40x40?text=Author';
  };

  if (variant === 'horizontal') {
    return (
      <Link to={`/blog/${post.id}`} className="group">
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col md:flex-row">
            <div className="relative md:w-1/3 h-60 md:h-auto overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-custom-green text-white text-xs font-medium px-2 py-1 rounded-md">
                {post.category && (typeof post.category === 'object' ? post.category.name : post.category)}
              </div>
            </div>
            
            <div className="md:w-2/3 flex flex-col">
              <CardContent className="flex-grow pt-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold line-clamp-2 mb-2 group-hover:text-custom-green transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={getAuthorAvatar()}
                    alt={getAuthorName()}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">{getAuthorName()}</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-border pt-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date} • {post.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-custom-green" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4 text-custom-green" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </div>
          </div>
        </Card>
      </Link>
    );
  }
  
  return (
    <Link to={`/blog/${post.id}`} className="group">
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative h-60 overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-custom-green text-white text-xs font-medium px-2 py-1 rounded-md">
            {post.category && (typeof post.category === 'object' ? post.category.name : post.category)}
          </div>
        </div>
        
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold line-clamp-2 mb-2 group-hover:text-custom-green transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground line-clamp-3">
              {post.excerpt}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src={getAuthorAvatar()} 
              alt={getAuthorName()}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">{getAuthorName()}</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-border pt-4 text-sm text-muted-foreground mt-auto">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{post.date} • {post.readTime}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4 text-custom-green" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4 text-custom-green" />
                <span>{post.comments}</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PostCard;
