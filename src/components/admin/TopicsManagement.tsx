import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define the schema for topic validation
const topicSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
});

type Topic = z.infer<typeof topicSchema>;

const TopicsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch topics using react-query
  const { data: topics, isLoading, error } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const mockTopics = [
        { id: '1', name: 'Technology', slug: 'technology', count: 12 },
        { id: '2', name: 'Travel', slug: 'travel', count: 25 },
        { id: '3', name: 'Food', slug: 'food', count: 18 },
        { id: '4', name: 'Lifestyle', slug: 'lifestyle', count: 30 },
      ];
      return mockTopics;
    },
  });

  // Form configuration
  const form = useForm<Topic>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  // Add topic mutation
  const addTopicMutation = useMutation({
    mutationFn: async (data: Topic) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Adding topic:', data);
      return { success: true, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Success",
        description: "Topic added successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to add topic: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update topic mutation
  const updateTopicMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Topic }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Updating topic ${id} with:`, data);
      return { success: true, id, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Success",
        description: "Topic updated successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update topic: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete topic mutation
  const deleteTopicMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Deleting topic:', id);
      return { success: true, id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete topic: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Function to handle adding a new topic
  const addTopic = async (data: { name: string; slug: string }) => {
    try {
      // Add count property with default value
      const newTopic = { 
        ...data, 
        count: 0 // Default count for new topic
      };
      await addTopicMutation.mutateAsync(newTopic);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to add topic: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Function to handle updating an existing topic
  const updateTopic = async (id: string, data: Topic) => {
    try {
      await updateTopicMutation.mutateAsync({ id, data });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update topic: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Function to handle deleting a topic
  const deleteTopic = async (id: string) => {
    try {
      await deleteTopicMutation.mutateAsync(id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete topic: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Filter topics based on search query
  const filteredTopics = topics?.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle edit button click
  const handleEdit = (topic: Topic) => {
    setSelectedTopic(topic);
    form.setValue("name", topic.name);
    form.setValue("slug", topic.slug);
    setIsDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (id: string) => {
    deleteTopic(id);
  };

  // Handle dialog open
  const handleOpenDialog = () => {
    setSelectedTopic(null);
    form.reset();
    setIsDialogOpen(true);
  };

  // Handle form submission
  const onSubmit = async (data: Topic) => {
    if (selectedTopic) {
      // Update existing topic
      updateTopic(selectedTopic.id!, data);
    } else {
      // Add new topic
      addTopic(data);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Topics Management</h2>
        <Button onClick={handleOpenDialog}>Add Topic</Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
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
                <TableHead>Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTopics?.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell>{topic.name}</TableCell>
                  <TableCell>{topic.slug}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{topic.count}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(topic)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(topic.id!)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTopic ? "Edit Topic" : "Add Topic"}</DialogTitle>
            <DialogDescription>
              {selectedTopic ? "Edit the topic details." : "Create a new topic."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Topic name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Topic slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">
                  {selectedTopic ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopicsManagement;
