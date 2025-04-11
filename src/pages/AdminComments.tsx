
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquare, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Comment {
  id: string;
  author: string;
  post: string;
  content: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminComments = () => {
  // Mock comments data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Emma Wilson',
      post: 'Top 10 Beach Destinations',
      content: "What's your favorite hidden gem in Europe?",
      date: '2 days ago',
      status: 'approved'
    },
    {
      id: '2',
      author: 'David Chen',
      post: 'Budget Travel Tips',
      content: "I'm planning a trip to Southeast Asia next month.",
      date: '5 days ago',
      status: 'approved'
    },
    {
      id: '3',
      author: 'Sarah Johnson',
      post: 'Solo Travel Guide',
      content: 'Solo female travel safety tips?',
      date: '1 week ago',
      status: 'rejected'
    }
  ]);
  
  // Filter state
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Selected comment for details view
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  // Filter comments based on selected tab
  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true;
    return comment.status === filter;
  });

  return (
    <AdminLayout activeItem="comments">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Comments</h1>
        
        <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
          <TabsList>
            <TabsTrigger value="all">All ({comments.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({comments.filter(c => c.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({comments.filter(c => c.status === 'approved').length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({comments.filter(c => c.status === 'rejected').length})</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white">
                <div className="p-4">
                  <h3 className="text-xl font-bold flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Comments ({filteredComments.length})
                  </h3>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No comments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredComments.map((comment) => (
                        <TableRow key={comment.id}>
                          <TableCell className="font-medium">{comment.author}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{comment.content}</TableCell>
                          <TableCell>{comment.date}</TableCell>
                          <TableCell>
                            <Badge variant={
                              comment.status === 'approved' ? 'default' : 
                              comment.status === 'rejected' ? 'destructive' : 
                              'outline'
                            } className={
                              comment.status === 'approved' ? 'bg-green-500' : 
                              comment.status === 'rejected' ? 'bg-red-500' : 
                              'bg-gray-100 text-gray-800'
                            }>
                              {comment.status === 'approved' ? 'Visible' : 
                               comment.status === 'rejected' ? 'Hidden' : 
                               'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => setSelectedComment(comment)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                // Toggle visibility
                                setComments(comments.map(c => 
                                  c.id === comment.id 
                                    ? { ...c, status: c.status === 'approved' ? 'rejected' : 'approved' } 
                                    : c
                                ))
                              }}
                            >
                              {comment.status === 'approved' ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500"
                              onClick={() => {
                                setComments(comments.filter(c => c.id !== comment.id));
                                if (selectedComment?.id === comment.id) {
                                  setSelectedComment(null);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </div>
            
            <Card className="bg-white p-6 h-fit">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Comment Details
              </h3>
              
              {selectedComment ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Author</h4>
                    <p>{selectedComment.author}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Post</h4>
                    <p>{selectedComment.post}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Date</h4>
                    <p>{selectedComment.date}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Comment</h4>
                    <p className="whitespace-pre-wrap">{selectedComment.content}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <Badge variant={
                      selectedComment.status === 'approved' ? 'default' : 
                      selectedComment.status === 'rejected' ? 'destructive' : 
                      'outline'
                    } className={
                      selectedComment.status === 'approved' ? 'bg-green-500' : 
                      selectedComment.status === 'rejected' ? 'bg-red-500' : 
                      'bg-gray-100 text-gray-800'
                    }>
                      {selectedComment.status === 'approved' ? 'Visible' : 
                       selectedComment.status === 'rejected' ? 'Hidden' : 
                       'Pending'}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setComments(comments.map(c => 
                          c.id === selectedComment.id 
                            ? { ...c, status: 'rejected' } 
                            : c
                        ));
                        setSelectedComment({...selectedComment, status: 'rejected'});
                      }}
                    >
                      <EyeOff className="mr-2 h-4 w-4" /> Hide
                    </Button>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setComments(comments.map(c => 
                          c.id === selectedComment.id 
                            ? { ...c, status: 'approved' } 
                            : c
                        ));
                        setSelectedComment({...selectedComment, status: 'approved'});
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" /> Show
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">
                  Select a comment to view details
                </div>
              )}
            </Card>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminComments;
