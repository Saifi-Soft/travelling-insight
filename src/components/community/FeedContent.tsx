
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ThumbsUp, MessageCircle, Share2, MapPin, Bookmark, MoreHorizontal } from 'lucide-react';
import { communityPostsApi } from '@/api/communityPostsService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
  isLiked?: boolean;
  isSaved?: boolean;
}

const FeedContent = () => {
  const [activeFilter, setActiveFilter] = useState('forYou');
  const userId = localStorage.getItem('community_user_id') || '';
  const queryClient = useQueryClient();

  // Fetch all posts
  const { data: allPosts = [], isLoading } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: communityPostsApi.getAllPosts,
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: ({ postId }: { postId: string }) => 
      communityPostsApi.likePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
    },
    onError: (error) => {
      console.error('Error liking post:', error);
      toast.error('Failed to like post. Please try again.');
    }
  });

  // Save post mutation
  const savePostMutation = useMutation({
    mutationFn: ({ postId }: { postId: string }) => 
      communityPostsApi.savePost(postId, userId),
    onSuccess: () => {
      toast.success('Post saved to your collection');
    },
    onError: () => {
      toast.error('Failed to save post');
    }
  });

  // Filter posts based on active tab
  const posts = allPosts.filter((post: PostProps) => {
    if (activeFilter === 'forYou') return true;
    if (activeFilter === 'following') {
      // In a real implementation, filter posts from people the user follows
      return Math.random() > 0.5; // Dummy implementation for demo
    }
    return true;
  });

  const renderLoadingSkeleton = () => (
    Array.from({ length: 3 }).map((_, i) => (
      <Card key={i} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <Skeleton className="h-20 w-full mb-3" />
          <Skeleton className="h-[200px] w-full rounded-md" />
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-[80px]" />
              <Skeleton className="h-8 w-[80px]" />
              <Skeleton className="h-8 w-[80px]" />
            </div>
          </div>
        </CardFooter>
      </Card>
    ))
  );

  const handleLikePost = (postId: string) => {
    if (!userId) {
      toast.error('You must be logged in to like posts');
      return;
    }
    likePostMutation.mutate({ postId });
  };

  const handleSavePost = (postId: string) => {
    if (!userId) {
      toast.error('You must be logged in to save posts');
      return;
    }
    savePostMutation.mutate({ postId });
  };

  return (
    <div className="feed-content">
      <div className="p-4 border-b border-border">
        <Tabs defaultValue="forYou" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="forYou" onClick={() => setActiveFilter('forYou')}>For You</TabsTrigger>
            <TabsTrigger value="following" onClick={() => setActiveFilter('following')}>Following</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="p-4 space-y-4">
        {isLoading ? (
          renderLoadingSkeleton()
        ) : posts.length > 0 ? (
          posts.map((post: PostProps) => (
            <Card key={post._id} className="mb-4 border border-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2 pt-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border">
                      {post.userAvatar ? (
                        <AvatarImage src={post.userAvatar} alt={post.userName} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {post.userName.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{post.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric'
                        })}
                        {post.location && (
                          <span className="inline-flex items-center ml-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {post.location}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Share to chat</DropdownMenuItem>
                      <DropdownMenuItem>Not interested</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Report post</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="py-3 px-4">
                <p className="whitespace-pre-line mb-3 text-sm">{post.content}</p>
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {post.images.map((image, idx) => (
                      <img 
                        key={idx} 
                        src={image} 
                        alt="Post attachment" 
                        className="rounded-md object-cover w-full h-64"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="px-4 pb-3">
                <div className="w-full">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>{post.likes} likes • {post.comments} comments</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <Button variant="ghost" size="sm" onClick={() => handleLikePost(post._id || '')}>
                      <ThumbsUp className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-primary text-primary' : ''}`} />
                      Like
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSavePost(post._id || '')}>
                      <Bookmark className={`h-4 w-4 mr-2 ${post.isSaved ? 'fill-primary text-primary' : ''}`} />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No posts yet. Follow travelers to see their content!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeedContent;
