import { Post } from '@/types/common';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PostForm from './PostForm';

interface PostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPost: Post | null;
  onSubmit: (formData: Omit<Post, 'id'>) => void;
  isLoading: boolean;
}

const PostDialog = ({ isOpen, onOpenChange, currentPost, onSubmit, isLoading }: PostDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {currentPost ? "Edit Post" : "Create New Post"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {currentPost ? "Make changes to the existing post." : "Fill out the form to create a new post."}
          </p>
        </DialogHeader>
        
        <PostForm 
          initialData={currentPost} 
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;