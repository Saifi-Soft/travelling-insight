import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  likes: number;
}

interface PostCommentsProps {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const PostComments = ({ comments, setComments }: PostCommentsProps) => {
  const [commentText, setCommentText] = useState("");
  const { toast } = useToast();
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    const newComment = {
      id: comments.length + 1,
      author: {
        name: "You",
        avatar: "https://i.pravatar.cc/150?img=67"
      },
      content: commentText,
      date: "Just now",
      likes: 0
    };
    
    setComments([...comments, newComment]);
    setCommentText("");
    
    toast({
      title: "Comment posted",
      description: "Your comment has been added to the discussion",
    });
  };
  
  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">
        Comments ({comments.length})
      </h3>
      
      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mb-8">
        <Textarea 
          placeholder="Share your thoughts..." 
          className="min-h-32 mb-3"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button type="submit" className="bg-primary">
          Post Comment
        </Button>
      </form>
      
      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
              <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium">{comment.author.name}</h4>
                <span className="text-sm text-muted-foreground">{comment.date}</span>
              </div>
              <p className="text-muted-foreground mb-2">{comment.content}</p>
              <div>
                <Button variant="ghost" size="sm" className="h-auto px-2 py-1">
                  <Heart className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">{comment.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-auto px-2 py-1">
                  <span className="text-xs">Reply</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostComments;
