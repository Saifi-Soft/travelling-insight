import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/api/apiService';
import { Post } from '@/types/common';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import PostsList from './PostsList';
import PostDialog from './PostDialog';

const PostsAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all posts
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: postsApi.getAll,
  });
  
  // Create post mutation
  const createMutation = useMutation({
    mutationFn: postsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create post: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Update post mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, post }: { id: string; post: Partial<Post> }) => postsApi.update(id, post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update post: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: postsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete post: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handlers
  const handleAddNew = () => {
    setCurrentPost(null);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (post: Post) => {
    setCurrentPost(post);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleSubmit = (formData: Omit<Post, 'id'>) => {
    if (currentPost) {
      updateMutation.mutate({ id: currentPost.id, post: formData });
    } else {
      createMutation.mutate(formData);
    }
  };
  
  if (error) {
    return <div className="text-red-500">Error loading posts: {(error as Error).message}</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Posts Management</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add New Post
        </Button>
      </div>
      
      <PostsList 
        posts={posts} 
        isLoading={isLoading} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
      
      <PostDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        currentPost={currentPost}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default PostsAdmin;
