
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/api/apiService'; // Assuming this API service exists
import { Post } from '@/types/common';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search } from 'lucide-react';
import PostsList from './PostsList';
import PostEditor from './PostEditor';
import { Input } from "@/components/ui/input";

const PostsManagement = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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
      setIsEditorOpen(false);
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
      setIsEditorOpen(false);
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
    setIsEditorOpen(true);
  };
  
  const handleEdit = (post: Post) => {
    setCurrentPost(post);
    setIsEditorOpen(true);
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
  
  // Filter posts based on search query
  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (isEditorOpen) {
    return (
      <PostEditor
        post={currentPost}
        onSubmit={handleSubmit}
        onCancel={() => setIsEditorOpen(false)}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Posts Management</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Create New Post
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <PostsList 
        posts={filteredPosts} 
        isLoading={isLoading} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
      
      {error && (
        <div className="text-red-500 mt-4">
          Error loading posts: {(error as Error).message}
        </div>
      )}
    </div>
  );
};

export default PostsManagement;
