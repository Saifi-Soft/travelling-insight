
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertTriangle, Ban, CheckCircle, Eye } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ContentModerationPanel = () => {
  const [selectedTab, setSelectedTab] = useState('warnings');
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [viewWarningDialog, setViewWarningDialog] = useState(false);
  const [blockUserConfirmDialog, setBlockUserConfirmDialog] = useState(false);
  
  // Ensure we have the necessary APIs
  const { data: api } = useQuery({
    queryKey: ['communityApiWithModeration'],
    queryFn: async () => {
      // In a real app, you would ensure these APIs are properly loaded
      const globalApi = (window as any).communityApi || {};
      if (!globalApi.moderation) {
        throw new Error('Moderation API not loaded');
      }
      return globalApi;
    }
  });
  
  // Fetch warnings
  const { data: contentWarnings = [], isLoading: warningsLoading } = useQuery({
    queryKey: ['contentWarnings'],
    queryFn: () => api?.moderation?.getAllContentWarnings() || [],
    enabled: !!api?.moderation,
  });
  
  // Fetch moderated posts
  const { data: moderatedPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['moderatedPosts'],
    queryFn: () => api?.posts?.getModeratedPosts() || [],
    enabled: !!api?.posts,
  });
  
  const handleBlockUser = async (userId: string) => {
    try {
      if (api?.users?.updateStatus) {
        await api.users.updateStatus(userId, 'blocked');
        // In a real app you'd invalidate queries here
      }
      setBlockUserConfirmDialog(false);
      // Show success message
    } catch (error) {
      console.error('Error blocking user:', error);
      // Show error message
    }
  };
  
  const viewWarning = (warning: any) => {
    setSelectedContent(warning);
    setViewWarningDialog(true);
  };
  
  const confirmBlockUser = (user: any) => {
    setSelectedContent(user);
    setBlockUserConfirmDialog(true);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Content Moderation</h2>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="warnings">User Warnings</TabsTrigger>
          <TabsTrigger value="posts">Moderated Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="warnings" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Content Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {warningsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : contentWarnings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No content warnings found
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Warning Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contentWarnings.map((warning: any) => (
                        <TableRow key={warning._id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {warning.userName?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{warning.userName || 'Unknown User'}</p>
                                <p className="text-xs text-muted-foreground">{warning.userEmail || 'No email'}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {warning.reason}
                          </TableCell>
                          <TableCell>
                            {new Date(warning.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {warning.userStatus === 'blocked' ? (
                              <Badge variant="destructive">Blocked</Badge>
                            ) : (
                              <Badge variant={warning.acknowledged ? "outline" : "secondary"}>
                                {warning.acknowledged ? "Acknowledged" : "Unacknowledged"}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => viewWarning(warning)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {warning.userStatus !== 'blocked' && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => confirmBlockUser(warning)}
                                >
                                  <Ban className="h-4 w-4 mr-1" />
                                  Block
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="posts" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ban className="h-5 w-5 mr-2 text-destructive" />
                Moderated Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : moderatedPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No moderated posts found
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Content Preview</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {moderatedPosts.map((post: any) => (
                        <TableRow key={post._id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {post.userName?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <p className="font-medium text-sm">{post.userName}</p>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {post.content}
                          </TableCell>
                          <TableCell>
                            {post.moderationReason}
                          </TableCell>
                          <TableCell>
                            {new Date(post.moderatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => viewWarning(post)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Warning Details Dialog */}
      <Dialog open={viewWarningDialog} onOpenChange={setViewWarningDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Warning Details</DialogTitle>
          </DialogHeader>
          
          {selectedContent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">User Information</div>
                <div className="flex items-center gap-2 bg-secondary/50 p-3 rounded-md">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {selectedContent.userName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedContent.userName || 'Unknown User'}</p>
                    <p className="text-sm text-muted-foreground">{selectedContent.userEmail || 'No email'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Content</div>
                <div className="bg-secondary/50 p-3 rounded-md">
                  <p className="whitespace-pre-line">{selectedContent.content || selectedContent.reason}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Date</div>
                  <div className="text-sm">
                    {new Date(selectedContent.createdAt || selectedContent.moderatedAt).toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">Status</div>
                  <div>
                    {selectedContent.userStatus === 'blocked' ? (
                      <Badge variant="destructive">User Blocked</Badge>
                    ) : selectedContent.moderated ? (
                      <Badge variant="destructive">Content Removed</Badge>
                    ) : (
                      <Badge variant="outline">Active</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewWarningDialog(false)}>
              Close
            </Button>
            {selectedContent && selectedContent.userStatus !== 'blocked' && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  setViewWarningDialog(false);
                  confirmBlockUser(selectedContent);
                }}
              >
                <Ban className="h-4 w-4 mr-1" />
                Block User
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Block User Confirmation Dialog */}
      <Dialog open={blockUserConfirmDialog} onOpenChange={setBlockUserConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User</DialogTitle>
            <DialogDescription>
              Are you sure you want to block this user? This will prevent them from accessing the community.
            </DialogDescription>
          </DialogHeader>
          
          {selectedContent && (
            <div className="flex items-center gap-2 bg-secondary/50 p-3 rounded-md">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {selectedContent.userName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedContent.userName || 'Unknown User'}</p>
                <p className="text-sm text-muted-foreground">{selectedContent.userEmail || 'No email'}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockUserConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedContent && handleBlockUser(selectedContent.userId)}
            >
              <Ban className="h-4 w-4 mr-1" />
              Block User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentModerationPanel;
