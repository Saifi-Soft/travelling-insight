
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi, categoriesApi, topicsApi } from '@/api/mongoApiService';
import { Post } from '@/types/common';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Loader2 } from 'lucide-react';
import PostsList from './PostsList';
import PostEditor from './PostEditor';
import { Input } from "@/components/ui/input";

const PostsAdmin = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all posts
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: postsApi.getAll,
  });
  
  // Fetch categories and topics for the editor
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });
  
  const { data: topics = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: topicsApi.getAll,
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
        description: `Failed to create post: ${(error as Error).message}`,
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
        description: `Failed to update post: ${(error as Error).message}`,
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
        description: `Failed to delete post: ${(error as Error).message}`,
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
  
  const handleSave = (formData: any) => {
    if (currentPost) {
      updateMutation.mutate({ id: currentPost.id, post: formData });
    } else {
      createMutation.mutate(formData);
    }
  };
  
  // Filter posts based on search query
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (isEditorOpen) {
    return (
      <PostEditor
        post={currentPost}
        onSave={handleSave}
        onCancel={() => setIsEditorOpen(false)}
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
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-red-500 mt-4">
          Error loading posts: {(error as Error).message}
        </div>
      ) : (
        <PostsList 
          posts={filteredPosts} 
          isLoading={isLoading} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  );
};

export default PostsAdmin;
