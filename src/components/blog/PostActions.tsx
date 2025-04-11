import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Bookmark, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface PostActionsProps {
  initialLikes: number;
  commentCount: number;
  onShareClick: (platform: string) => void;
}

const PostActions = ({ initialLikes, commentCount, onShareClick }: PostActionsProps) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const { toast } = useToast();
  
  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? "Removed from likes" : "Added to likes",
      description: liked ? "Post removed from your likes" : "Post added to your likes",
    });
  };
  
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast({
      title: bookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: bookmarked 
        ? "Post removed from your bookmarks" 
        : "Post added to your bookmarks for later reading",
    });
  };
  
  return (
    <div className="mt-8 py-6 border-t border-border">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            className={liked ? "text-red-500" : ""}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 mr-1 ${liked ? "fill-current" : ""}`} />
            <span>{liked ? initialLikes + 1 : initialLikes}</span>
          </Button>
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-5 w-5 mr-1" />
            <span>{commentCount}</span>
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className={bookmarked ? "text-primary" : ""}
            onClick={handleBookmark}
          >
            <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onShareClick("Facebook")}>
            <Facebook className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onShareClick("Twitter")}>
            <Twitter className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onShareClick("Link")}>
            <LinkIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostActions;