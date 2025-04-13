
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { topicsApi } from '@/api/mongoApiService';
import { Loader2, Plus, Trash, Pencil, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Hashtag {
  id?: string;
  name: string;
  slug: string;
  count?: number;
}

const HashtagsManagement = () => {
  const [newHashtag, setNewHashtag] = useState('');
  const [editingHashtag, setEditingHashtag] = useState<Hashtag | null>(null);
  const [editedName, setEditedName] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all hashtags (topics)
  const { data: hashtags = [], isLoading: isLoadingHashtags } = useQuery({
    queryKey: ['topics'],
    queryFn: topicsApi.getAll,
  });
  
  // Create hashtag mutation
  const createMutation = useMutation({
    mutationFn: topicsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Success",
        description: "Hashtag created successfully",
      });
      setNewHashtag('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create hashtag: ${(error as Error).message}`,
        variant: "destructive",
      });
    },
  });
  
  // Update hashtag mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, hashtag }: { id: string; hashtag: Partial<Hashtag> }) => topicsApi.update(id, hashtag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Success",
        description: "Hashtag updated successfully",
      });
      setEditingHashtag(null);
      setEditedName('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update hashtag: ${(error as Error).message}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete hashtag mutation
  const deleteMutation = useMutation({
    mutationFn: topicsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Success",
        description: "Hashtag deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete hashtag: ${(error as Error).message}`,
        variant: "destructive",
      });
    },
  });
  
  // Generate slug from name
  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newHashtag.trim()) return;
    
    const hashtag: Hashtag = {
      name: newHashtag.trim(),
      slug: generateSlug(newHashtag.trim()),
      count: 0
    };
    
    createMutation.mutate(hashtag);
  };
  
  // Handle edit form submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingHashtag || !editedName.trim()) return;
    
    const updatedHashtag: Partial<Hashtag> = {
      name: editedName.trim(),
      slug: generateSlug(editedName.trim())
    };
    
    updateMutation.mutate({ id: editingHashtag.id!, hashtag: updatedHashtag });
  };
  
  // Handle deletion
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this hashtag?")) {
      deleteMutation.mutate(id);
    }
  };
  
  // Start editing
  const handleEdit = (hashtag: Hashtag) => {
    setEditingHashtag(hashtag);
    setEditedName(hashtag.name);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingHashtag(null);
    setEditedName('');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Hashtags</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex items-end gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="new-hashtag" className="mb-2 block">New Hashtag</Label>
            <Input 
              id="new-hashtag" 
              value={newHashtag} 
              onChange={(e) => setNewHashtag(e.target.value)} 
              placeholder="Enter hashtag name" 
            />
          </div>
          <Button 
            type="submit" 
            disabled={!newHashtag.trim() || createMutation.isPending}
            className="flex items-center gap-2"
          >
            {createMutation.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Adding...</>
            ) : (
              <><Plus className="h-4 w-4" /> Add</>
            )}
          </Button>
        </form>
        
        {isLoadingHashtags ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Existing Hashtags</h3>
            
            {hashtags.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No hashtags found. Add your first one!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hashtags.map((hashtag) => (
                  <div 
                    key={hashtag.id} 
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    {editingHashtag?.id === hashtag.id ? (
                      <form onSubmit={handleEditSubmit} className="flex-1 flex gap-2">
                        <Input 
                          value={editedName} 
                          onChange={(e) => setEditedName(e.target.value)}
                          autoFocus
                          className="flex-1"
                        />
                        <div className="flex gap-1">
                          <Button 
                            type="submit" 
                            size="sm"
                            variant="outline"
                            disabled={updateMutation.isPending || !editedName.trim()}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            disabled={updateMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex flex-col">
                          <span className="font-medium">{hashtag.name}</span>
                          <span className="text-xs text-muted-foreground">#{hashtag.slug}</span>
                          {typeof hashtag.count === 'number' && (
                            <Badge variant="secondary" className="mt-1 w-fit">
                              {hashtag.count} {hashtag.count === 1 ? 'post' : 'posts'}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleEdit(hashtag)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(hashtag.id!)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HashtagsManagement;
