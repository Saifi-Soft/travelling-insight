import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { topicsApi } from '@/api/apiService'; // We'll use the topics API for hashtags
import { Topic } from '@/types/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Plus, Loader2, Search, Hash } from 'lucide-react';
import { Label } from '@/components/ui/label';

const HashtagsManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentHashtag, setCurrentHashtag] = useState<Topic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all hashtags (topics)
  const { data: hashtags, isLoading, error } = useQuery({
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
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create hashtag: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Update hashtag mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, topic }: { id: string; topic: Partial<Topic> }) => 
      topicsApi.update(id, topic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Success",
        description: "Hashtag updated successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update hashtag: ${error.message}`,
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
        description: `Failed to delete hashtag: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
    });
    setCurrentHashtag(null);
  };
  
  const handleAddNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  const handleEdit = (hashtag: Topic) => {
    setCurrentHashtag(hashtag);
    setFormData({
      name: hashtag.name,
      slug: hashtag.slug,
    });
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this hashtag?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentHashtag) {
      updateMutation.mutate({
        id: currentHashtag.id,
        topic: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Automatically add # to the beginning if it's the name field
    if (name === 'name' && value && !value.startsWith('#')) {
      processedValue = `#${value}`;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };
  
  const handleSlugGenerate = () => {
    // Remove # from the beginning for slug generation
    const nameWithoutHash = formData.name.startsWith('#') 
      ? formData.name.substring(1) 
      : formData.name;
    
    const slug = nameWithoutHash
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    setFormData(prev => ({
      ...prev,
      slug
    }));
  };
  
  // Filter hashtags based on search query
  const filteredHashtags = hashtags?.filter(hashtag =>
    hashtag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const addHashtag = async (data: { name: string; slug: string }) => {
    try {
      // Add count property with default value
      const newHashtag = { 
        ...data, 
        count: 0 // Default count for new hashtag
      };
      createMutation.mutate(newHashtag);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add hashtag: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Hashtags Management</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add New Hashtag
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-red-500">Error loading hashtags: {(error as Error).message}</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hashtag</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Post Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHashtags?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No hashtags found. Create your first hashtag!
                  </TableCell>
                </TableRow>
              ) : (
                filteredHashtags?.map((hashtag) => (
                  <TableRow key={hashtag.id}>
                    <TableCell className="font-medium">
                      <span className="flex items-center">
                        <Hash className="mr-1 h-4 w-4 text-muted-foreground" />
                        {hashtag.name}
                      </span>
                    </TableCell>
                    <TableCell>{hashtag.slug}</TableCell>
                    <TableCell>{hashtag.count}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(hashtag)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(hashtag.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentHashtag ? "Edit Hashtag" : "Create New Hashtag"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div>
              <Label htmlFor="name">Hashtag Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="#travel"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSlugGenerate}
                  className="whitespace-nowrap"
                >
                  Generate
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {currentHashtag ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HashtagsManagement;
