import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { topicsApi } from '@/api/apiService';
import { Topic } from '@/types/common';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';

const TopicsAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all topics
  const { data: topics, isLoading, error } = useQuery({
    queryKey: ['topics'],
    queryFn: topicsApi.getAll,
  });

  // For now, display a simplified version
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Topics/Tags Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Topic
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
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
              {topics?.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">#{topic.name}</TableCell>
                  <TableCell>{topic.slug}</TableCell>
                  <TableCell>{topic.count}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TopicsAdmin;
