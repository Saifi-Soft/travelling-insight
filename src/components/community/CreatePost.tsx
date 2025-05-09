import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Image as ImageIcon, 
  MapPin, 
  Globe,
  X,
  Users,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { communityPostsApi } from '@/api/communityPostsService';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  
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
      tags?: string[];
      visibility: string;
    }) => communityPostsApi.createPost(postData),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      
      // Check if the post was moderated
      if (data && data.wasModerated) {
        toast.error('Your post was removed for containing inappropriate content. You have received a warning.', {
          icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
          duration: 6000,
        });
        
        // Also invalidate notifications to show the new warning
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } else {
        toast.success('Your post was published successfully!');
      }
      
      // Reset form either way
      setContent('');
      setLocation('');
      setImages([]);
      setTags([]);
      setVisibility('public');
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast.error('Failed to publish post. Please try again.');
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!content || !content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    if (!userId) {
      toast.error('You must be logged in to post');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createPostMutation.mutate({
        userId,
        userName: userName || 'Anonymous User',
        content,
        images,
        location: location || undefined,
        tags: tags.length > 0 ? tags : undefined,
        visibility
      });
      
      // The rest of the handling is in the mutation callbacks
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error('Failed to publish post. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // In a real app, you would upload these files to a server/cloud storage
    // and get back the URLs. For this demo, we'll create local object URLs
    setIsSubmitting(true);
    
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    
    // Simulate network delay
    setTimeout(() => {
      setImages(prev => [...prev, ...newImages]);
      setIsSubmitting(false);
      toast.success(`${files.length} image${files.length > 1 ? 's' : ''} added to your post`);
    }, 1000);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (tags.length >= 5) {
        toast.error('Maximum 5 tags allowed');
        return;
      }
      
      if (tags.includes(tagInput.trim())) {
        toast.error('Tag already added');
        return;
      }
      
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="p-4">
      <Card className="border-border bg-card/50">
        <CardHeader className="pb-3">
          <h3 className="text-xl font-semibold text-foreground">Create a Post</h3>
          <p className="text-sm text-muted-foreground">
            Share your adventures with the community 
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm underline ml-1"
              onClick={() => setShowPolicyDialog(true)}
            >
              View Community Guidelines
            </Button>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <Textarea 
                  placeholder="What's your travel story? Share tips, ask for advice, or post photos from your adventures..."
                  className="min-h-[150px] text-base bg-secondary/50"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isSubmitting}
                />
                
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {images.map((img, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img 
                          src={img} 
                          alt={`Preview ${index + 1}`} 
                          className="rounded-md object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-background/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text"
                      placeholder="Add location (optional)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-secondary/50"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Select value={visibility} onValueChange={setVisibility}>
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue placeholder="Visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Everyone</SelectItem>
                        <SelectItem value="connections">Connections only</SelectItem>
                        <SelectItem value="private">Only me</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="text"
                      placeholder="Add tags (press Enter to add, max 5)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      className="bg-secondary/50"
                      disabled={tags.length >= 5}
                    />
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-between items-center mt-4 pt-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting || !content.trim()} 
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-6 space-y-4">
        <Card className="bg-secondary/20 border-dashed">
          <CardContent className="p-4 text-center">
            <h4 className="font-semibold mb-2">Post Guidelines</h4>
            <ul className="text-sm text-muted-foreground text-left list-disc pl-5 space-y-1">
              <li>Share authentic travel experiences and insights</li>
              <li>Be respectful and inclusive in your content</li>
              <li>Avoid sharing personal contact information publicly</li>
              <li>Use relevant hashtags to increase your post's reach</li>
              <li>Include location details to help other travelers</li>
              <li className="text-destructive font-medium">No explicit/adult (18+) content allowed - violations lead to account suspension</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Community Guidelines</DialogTitle>
            <DialogDescription>
              Our guidelines ensure a safe and inclusive environment for all travelers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-destructive flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Content Moderation Policy
                </h3>
                <ul className="pl-5 list-disc space-y-1 mt-2">
                  <li>
                    <strong>Prohibited Content:</strong> Any content containing explicit adult material (18+), 
                    inappropriate imagery, or language is strictly prohibited.
                  </li>
                  <li>
                    <strong>Automated Detection:</strong> All posts are automatically scanned for prohibited content.
                  </li>
                  <li>
                    <strong>Warning System:</strong> Violations will result in your post being removed and a warning issued to your account.
                  </li>
                  <li className="text-destructive font-medium">
                    After receiving three warnings, your account will be automatically blocked.
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold">General Guidelines</h3>
                <ul className="pl-5 list-disc space-y-1 mt-2">
                  <li>Be respectful and kind to fellow community members</li>
                  <li>Share authentic and helpful travel information</li>
                  <li>Respect copyright and give credit where it's due</li>
                  <li>Protect your privacy and that of others</li>
                  <li>Report any content that violates these guidelines</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold">Getting Support</h3>
                <p className="mt-1">
                  If you believe your content was mistakenly flagged or you need assistance, 
                  please contact our support team through your profile settings.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowPolicyDialog(false)}>
              I understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;
