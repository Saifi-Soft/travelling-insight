
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { topicsApi } from '@/api/apiService';
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
import { Edit, Trash2, Plus, Loader2, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';

const TopicsManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all topics
  const { data: topics, isLoading, error } = useQuery({
    queryKey: ['topics'],
    queryFn: topicsApi.getAll,
  });
  
  // Create topic mutation
  const createMutation = useMutation({
    mutationFn: topicsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Success",
        description: "Topic created successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create topic: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Update topic mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, topic }: { id: string; topic: Partial<Topic> }) => 
      topicsApi.update(id, topic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Success",
        description: "Topic updated successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update topic: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete topic mutation
  const deleteMutation = useMutation({
    mutationFn: topicsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete topic: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
    });
    setCurrentTopic(null);
  };
  
  const handleAddNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  const handleEdit = (topic: Topic) => {
    setCurrentTopic(topic);
    setFormData({
      name: topic.name,
      slug: topic.slug,
    });
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentTopic) {
      updateMutation.mutate({
        id: currentTopic.id,
        topic: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSlugGenerate = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    setFormData(prev => ({
      ...prev,
      slug
    }));
  };
  
  // Filter topics based on search query
  const filteredTopics = topics?.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Topics Management</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add New Topic
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
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
        <div className="text-red-500">Error loading topics: {(error as Error).message}</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Post Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTopics?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No topics found. Create your first topic!
                  </TableCell>
                </TableRow>
              ) : (
                filteredTopics?.map((topic) => (
                  <TableRow key={topic.id}>
                    <TableCell className="font-medium">{topic.name}</TableCell>
                    <TableCell>{topic.slug}</TableCell>
                    <TableCell>{topic.count}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(topic)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(topic.id)}
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
              {currentTopic ? "Edit Topic" : "Create New Topic"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
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
                {currentTopic ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopicsManagement;
