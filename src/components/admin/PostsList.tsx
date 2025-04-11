import { Post } from '@/types/common';
import { Button } from '@/components/ui/button';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PostsListProps {
  posts: Post[] | undefined;
  isLoading: boolean;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}

const PostsList = ({ posts, isLoading, onEdit, onDelete }: PostsListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No posts found. Create your first post!
              </TableCell>
            </TableRow>
          ) : (
            posts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    className="w-12 h-12 object-cover rounded-md" 
                  />
                </TableCell>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEdit(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10"
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
    </div>
  );
};

export default PostsList;
