
import { useState } from 'react';
import { Post } from '@/types/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/api/apiService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PostFormProps {
  initialData: Post | null;
  onSubmit: (data: Omit<Post, 'id'>) => void;
  isLoading: boolean;
}

const defaultAuthor = {
  name: 'Admin User',
  avatar: 'https://i.pravatar.cc/150?img=1',
};

const PostForm = ({ initialData, onSubmit, isLoading }: PostFormProps) => {
  const [formData, setFormData] = useState<Omit<Post, 'id'>>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    author: initialData?.author || defaultAuthor,
    category: initialData?.category || '',
    coverImage: initialData?.coverImage || '',
    date: initialData?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: initialData?.readTime || '5 min read',
    likes: initialData?.likes || 0,
    comments: initialData?.comments || 0,
  });
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right" htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right" htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right" htmlFor="category-select">Category</Label>
          <div className="col-span-3">
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category-select">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right" htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right" htmlFor="readTime">Read Time</Label>
          <Input
            id="readTime"
            name="readTime"
            value={formData.readTime}
            onChange={handleChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label className="text-right" htmlFor="likes">Likes</Label>
            <Input
              id="likes"
              name="likes"
              type="number"
              value={formData.likes}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                likes: parseInt(e.target.value)
              }))}
              min="0"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 items-center gap-4">
            <Label className="text-right" htmlFor="comments">Comments</Label>
            <Input
              id="comments"
              name="comments"
              type="number"
              value={formData.comments}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                comments: parseInt(e.target.value)
              }))}
              min="0"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;