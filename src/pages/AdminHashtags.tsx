
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mongoApiService } from '@/api/mongoApiService';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Plus, Loader2, Search } from 'lucide-react';

const AdminHashtags = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', slug: '' });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all topics
  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      try {
        return await mongoApiService.queryDocuments('topics', {});
      } catch (error) {
        console.error("Error fetching topics:", error);
        return [];
      }
    }
  });

  // Create topic mutation
  const createMutation = useMutation({
    mutationFn: async (topic: { name: string; slug: string }) => {
      return await mongoApiService.insertDocument('topics', {
        ...topic,
        count: 0,
        createdAt: new Date()
      });
    },
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
        description: `Failed to create hashtag: ${(error as Error).message}`,
        variant: "destructive",
      });
    },
  });

  // Update topic mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, topic }: { id: string; topic: any }) => {
      return await mongoApiService.updateDocument('topics', id, topic);
    },
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
        description: `Failed to update hashtag: ${(error as Error).message}`,
        variant: "destructive",
      });
    },
  });

  // Delete topic mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await mongoApiService.deleteDocument('topics', id);
    },
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-generate slug from name if it's the name field changing
    if (name === 'name') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '' });
    setCurrentTopic(null);
  };

  const handleOpenDialog = (topic?: any) => {
    if (topic) {
      setCurrentTopic(topic);
      setFormData({ name: topic.name, slug: topic.slug });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast({
        title: "Validation Error",
        description: "Name and slug are required",
        variant: "destructive",
      });
      return;
    }

    if (currentTopic) {
      updateMutation.mutate({
        id: currentTopic._id,
        topic: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Filter topics based on search
  const filteredTopics = topics.filter((topic: any) =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout activeItem="posts">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Hashtags Management</h1>
          <p className="text-gray-500 mt-2">Create, edit, and manage hashtags for your blog posts</p>
        </div>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Hashtags</CardTitle>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add Hashtag
            </Button>
          </CardHeader>
          <CardContent>
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
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Posts Count</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTopics.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No hashtags found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTopics.map((topic: any) => (
                        <TableRow key={topic._id}>
                          <TableCell className="font-medium">#{topic.name}</TableCell>
                          <TableCell>{topic.slug}</TableCell>
                          <TableCell>{topic.count || 0}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOpenDialog(topic)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the hashtag "#{topic.name}". This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(topic._id)}
                                      className="bg-destructive text-destructive-foreground"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Topic/Hashtag Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {currentTopic ? 'Edit Hashtag' : 'Add New Hashtag'}
                  </DialogTitle>
                  <DialogDescription>
                    {currentTopic
                      ? 'Update the details for this hashtag.'
                      : 'Create a new hashtag for your blog posts.'}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="grid gap-2">
                    <label htmlFor="name">Name</label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Hashtag name (without #)"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="slug">Slug</label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="hashtag-slug"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
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
                      {currentTopic ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminHashtags;
