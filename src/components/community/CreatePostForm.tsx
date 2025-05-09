
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Camera, MapPin, X, Loader2 } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { communityPostsApi } from '@/api/communityPostsService';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreatePostForm = () => {
  const { session } = useSession();
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  
  // Simulate image upload in browser environment
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    // For demo purposes, we're creating a data URL
    // In a real app, you would upload to your storage service
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        setImages([...images, event.target.result.toString()]);
      }
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      toast.error('Image upload failed');
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const createPostMutation = useMutation({
    mutationFn: (postData: any) => communityPostsApi.createPost(postData),
    onSuccess: () => {
      setContent('');
      setLocation('');
      setImages([]);
      toast.success('Post created successfully!');
      // Refresh posts list
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }
    
    if (!session.isAuthenticated || !session.user) {
      toast.error('You must be logged in to create posts');
      return;
    }
    
    createPostMutation.mutate({
      userId: session.user.id,
      userName: session.user.name || 'Anonymous User',
      userAvatar: undefined, // In a real app, this would be user's avatar URL
      content: content.trim(),
      images: images.length > 0 ? images : undefined,
      location: location.trim() || undefined
    });
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              {session.user?.name ? (
                <div className="bg-primary text-white h-full w-full flex items-center justify-center rounded-full">
                  {session.user.name.charAt(0)}
                </div>
              ) : (
                <div className="bg-gray-300 h-full w-full rounded-full" />
              )}
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <Textarea 
                placeholder={`What's on your mind, ${session.user?.name || 'traveler'}?`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="resize-none"
                disabled={!session.isAuthenticated || createPostMutation.isPending}
              />
              
              {images.length > 0 && (
                <div className={`grid gap-2 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Uploaded ${index}`} 
                        className="rounded-md object-cover w-full h-32"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {location && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {location}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex space-x-2">
                  <label className="cursor-pointer">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                      disabled={isUploading || createPostMutation.isPending}
                    />
                    <div className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                      <span>Photo</span>
                    </div>
                  </label>
                  
                  <div 
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={() => {
                      const userLocation = prompt("Enter your location:");
                      if (userLocation) setLocation(userLocation);
                    }}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  disabled={!content.trim() || !session.isAuthenticated || createPostMutation.isPending}
                >
                  {createPostMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
