
import React from 'react';
import { Post } from '@/types/common';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface PostsListProps {
  posts: Post[];
  isLoading: boolean;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

const PostsList = ({ posts, isLoading, onEdit, onDelete }: PostsListProps) => {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-full" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-9 w-24 ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  // Helper function to get category display
  const getCategoryDisplay = (category: string | { id: string; name: string; slug: string; } | undefined) => {
    if (!category) return 'Uncategorized';
    if (typeof category === 'string') return category;
    return category.name;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No posts found. Create your first post!
            </TableCell>
          </TableRow>
        ) : (
          posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">
                {post.title}
              </TableCell>
              <TableCell>
                {getCategoryDisplay(post.category)}
              </TableCell>
              <TableCell>{post.date}</TableCell>
              <TableCell>
                <Badge variant={
                  post.status === 'published' ? "default" : 
                  post.status === 'draft' ? "outline" : "secondary"
                }>
                  {post.status || 'draft'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Link to={`/blog/${post.id}`} target="_blank">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" onClick={() => onEdit(post)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => onDelete(post.id)}
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
  );
};

export default PostsList;
