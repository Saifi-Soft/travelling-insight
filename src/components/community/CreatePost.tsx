
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { communityPostsApi } from '@/api/communityPostsService';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const userId = localStorage.getItem('community_user_id') || '';
  const userName = localStorage.getItem('userName') || 'Anonymous User';

  // Create a new post
  const createPostMutation = useMutation({
    mutationFn: (postData: {
      userId: string;
      userName: string;
      content: string;
      images?: string[];
      location?: string;
    }) => communityPostsApi.createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      setContent('');
      toast.success('Post created successfully!');
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    
    createPostMutation.mutate({
      userId,
      userName,
      content,
      images: []
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <h3 className="text-xl font-bold">Create a Post</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea 
                  placeholder="Share your travel experiences or ask the community for advice..."
                  className="min-h-[150px] text-base focus-visible:ring-purple-500"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" type="button" onClick={() => toast.info('Photo upload coming soon!')}>
                  <Image className="h-4 w-4 mr-2" />
                  Photo
                </Button>
                <Button variant="outline" size="sm" type="button" onClick={() => toast.info('Location tagging coming soon!')}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </Button>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting || !content.trim()} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="text-center p-6 bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700">
        <h4 className="text-lg font-medium mb-2">Share Your Journey</h4>
        <p className="text-slate-300">
          Connect with fellow travelers by sharing your experiences, asking questions, or posting photos from your adventures.
        </p>
      </div>
    </div>
  );
};

export default CreatePost;
