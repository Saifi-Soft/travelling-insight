
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageCircle, Share2, MapPin, Send, Loader2 } from 'lucide-react';
import { communityPostsApi } from '@/api/communityPostsService';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/hooks/useSession';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface PostProps {
  _id?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  images?: string[];
  location?: string;
  createdAt: string;
  likes: number;
  comments: number;
  likedBy?: string[];
}

interface CommentProps {
  _id?: string;
  commentId: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  const [commentText, setCommentText] = useState('');
  const queryClient = useQueryClient();
  
  if (!postId) {
    navigate('/community-hub');
    return null;
  }
  
  const userId = session.user?.id || localStorage.getItem('community_user_id') || '';
  const userName = session.user?.name || localStorage.getItem('userName') || 'Anonymous User';
  
  // Fetch post details
  const {
    data: post,
    isLoading: postLoading,
    error: postError
  } = useQuery({
    queryKey: ['communityPost', postId],
    queryFn: async () => {
      const posts = await communityPostsApi.getAllPosts();
      return posts.find((p: any) => p._id === postId || p.id === postId);
    }
  });
  
  // Fetch comments for this post
  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError
  } = useQuery({
    queryKey: ['postComments', postId],
    queryFn: () => communityPostsApi.getComments(postId)
  });
  
  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: ({ postId, userId }: { postId: string, userId: string }) => 
      communityPostsApi.likePost(postId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['communityPost', postId] });
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      if (data.liked) {
        toast.success('Post liked!');
      } else {
        toast.success('Post unliked!');
      }
    },
    onError: (error) => {
      toast.error('Failed to like post. Please try again.');
    }
  });
  
  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (data: { postId: string, comment: any }) => 
      communityPostsApi.addComment(data.postId, data.comment),
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
      queryClient.invalidateQueries({ queryKey: ['communityPost', postId] });
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      toast.success('Comment added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add comment. Please try again.');
    }
  });
  
  const handleLike = () => {
    if (!userId) {
      toast.error('You must be logged in to like posts');
      return;
    }
    
    likePostMutation.mutate({ postId, userId });
  };
  
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      return;
    }
    
    if (!userId) {
      toast.error('You must be logged in to comment');
      return;
    }
    
    addCommentMutation.mutate({
      postId,
      comment: {
        userId,
        userName,
        content: commentText.trim()
      }
    });
  };
  
  const isPostLikedByUser = (post: PostProps) => {
    return post?.likedBy?.includes(userId);
  };
  
  if (postLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (!post) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Post not found</h2>
          <p className="text-muted-foreground mb-6">This post may have been removed or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/community-hub')}>Back to Community</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Post */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {post.userAvatar ? (
                <img src={post.userAvatar} alt={post.userName} className="rounded-full" />
              ) : (
                <div className="bg-primary text-white h-full w-full flex items-center justify-center rounded-full">
                  {post.userName.charAt(0)}
                </div>
              )}
            </Avatar>
            <div>
              <p className="font-semibold">{post.userName}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="whitespace-pre-line">{post.content}</p>
          {post.images && post.images.length > 0 && (
            <div className={`grid gap-2 mt-3 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {post.images.map((image, idx) => (
                <img key={idx} src={image} alt="Post attachment" className="rounded-md object-cover w-full" />
              ))}
            </div>
          )}
          {post.location && (
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              {post.location}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <div className="flex items-center justify-between">
              <span className="text-sm">{post.likes} likes • {comments.length || post.comments} comments</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between">
              <Button 
                variant="ghost" 
                onClick={handleLike}
                className={isPostLikedByUser(post) ? "text-blue-500" : ""}
                disabled={likePostMutation.isPending}
              >
                {likePostMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ThumbsUp className="h-4 w-4 mr-2" />
                )}
                Like
              </Button>
              <Button variant="ghost">
                <MessageCircle className="h-4 w-4 mr-2" />
                Comment
              </Button>
              <Button variant="ghost">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* Add comment */}
      {session.isAuthenticated && (
        <Card>
          <CardContent className="pt-4">
            <form onSubmit={handleAddComment} className="flex items-start gap-2">
              <Avatar className="h-8 w-8">
                {session.user?.name ? (
                  <div className="bg-primary text-white h-full w-full flex items-center justify-center rounded-full">
                    {session.user.name.charAt(0)}
                  </div>
                ) : (
                  <div className="bg-gray-300 h-full w-full rounded-full" />
                )}
              </Avatar>
              <Textarea 
                placeholder="Write a comment..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 min-h-[80px]"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="mt-2" 
                disabled={!commentText.trim() || addCommentMutation.isPending}
              >
                {addCommentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Comments */}
      <div className="space-y-4">
        <h3 className="font-medium">Comments ({comments.length || post.comments})</h3>
        
        {commentsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-2 pb-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-[120px] mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment: CommentProps) => (
              <div key={comment.commentId || comment._id} className="flex gap-2">
                <Avatar className="h-8 w-8">
                  {comment.userAvatar ? (
                    <img src={comment.userAvatar} alt={comment.userName} className="rounded-full" />
                  ) : (
                    <div className="bg-gray-200 text-gray-700 h-full w-full flex items-center justify-center rounded-full">
                      {comment.userName.charAt(0)}
                    </div>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-xl p-3">
                    <p className="font-medium text-sm">{comment.userName}</p>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-2">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
            {!session.isAuthenticated && (
              <Button variant="link" onClick={() => navigate('/login')}>Sign in to comment</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
