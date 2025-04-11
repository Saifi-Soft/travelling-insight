
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/api/mongoApiService';
import { Comment } from '@/types/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Search, Trash2, MessageSquare, Loader2 } from 'lucide-react';

const CommentsAdmin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch comments for the selected post
  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ['comments', selectedPostId],
    queryFn: () => selectedPostId ? commentsApi.getByPostId(selectedPostId) : Promise.resolve([]),
    enabled: !!selectedPostId,
  });

  // Delete comment mutation
  const deleteMutation = useMutation({
    mutationFn: commentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete comment: ${(error as Error).message}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter comments based on search query
  const filteredComments = comments.filter(comment => 
    comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comments Management</CardTitle>
          <CardDescription>
            Manage user comments across your blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoadingComments ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>Select a post to view its comments</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <img
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            className="h-8 w-8 rounded-full mr-2"
                          />
                          <span>{comment.author.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="line-clamp-2">{comment.content}</div>
                      </TableCell>
                      <TableCell>{new Date(comment.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the comment and remove it from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(comment.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentsAdmin;
