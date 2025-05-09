
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { ThumbsUp, MessageCircle, Share2, MapPin, Loader2 } from 'lucide-react';
import { communityPostsApi } from '@/api/communityPostsService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CreatePostForm from './CreatePostForm';
import { useSession } from '@/hooks/useSession';

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

const CommunityPosts = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { session } = useSession();

  const userId = session.user?.id || localStorage.getItem('community_user_id') || '';
  const userName = session.user?.name || localStorage.getItem('userName') || 'Anonymous User';

  // Fetch all posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: communityPostsApi.getAllPosts,
    staleTime: 1000 * 60 // 1 minute
  });

  // Like a post
  const likePostMutation = useMutation({
    mutationFn: ({ postId, userId }: { postId: string, userId: string }) => 
      communityPostsApi.likePost(postId, userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      if (data.liked) {
        toast.success('Post liked!');
      } else {
        toast.success('Post unliked!');
      }
    },
    onError: (error) => {
      console.error('Error liking post:', error);
      toast.error('Failed to like post. Please try again.');
    }
  });

  const handleLikePost = (postId: string) => {
    if (!userId) {
      toast.error('You must be logged in to like posts');
      return;
    }
    
    likePostMutation.mutate({ postId, userId });
  };

  const isPostLikedByUser = (post: PostProps) => {
    return post.likedBy?.includes(userId);
  };

  return (
    <div className="space-y-6">
      {/* Create post form */}
      {session.isAuthenticated && <CreatePostForm />}
      
      {/* Posts feed */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Community Posts</h2>
        
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-between">
                  <Skeleton className="h-8 w-[70px]" />
                  <Skeleton className="h-8 w-[70px]" />
                  <Skeleton className="h-8 w-[70px]" />
                </div>
              </CardFooter>
            </Card>
          ))
        ) : posts.length > 0 ? (
          // Actual posts
          posts.map((post: PostProps) => (
            <Card key={post._id}>
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
                    <span className="text-sm">{post.likes} likes • {post.comments} comments</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleLikePost(post._id || '')}
                      className={isPostLikedByUser(post) ? "text-blue-500" : ""}
                      disabled={likePostMutation.isPending}
                    >
                      {likePostMutation.isPending && post._id === likePostMutation.variables?.postId ? (
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
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              {session.isAuthenticated ? (
                <p className="text-gray-500">No posts yet. Be the first to share something!</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-500">Sign in to see and create community posts!</p>
                  <Button onClick={() => window.location.href = '/login'}>Sign In</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CommunityPosts;
