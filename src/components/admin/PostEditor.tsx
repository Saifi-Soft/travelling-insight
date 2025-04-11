
import { useState } from 'react';
import { Post } from '@/types/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Image as ImageIcon, Video, Bold, Italic, List, ListOrdered, Link2, Hash } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi, topicsApi } from '@/api/apiService';
import MediaUploader from './MediaUploader';
import RichTextEditor from './RichTextEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PostEditorProps {
  post: Post | null;
  onSubmit: (formData: Omit<Post, 'id'>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

// Default data for a new post
const defaultAuthor = {
  name: 'Admin User',
  avatar: 'https://i.pravatar.cc/150?img=1',
};

const defaultPostData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: defaultAuthor,
  category: '',
  coverImage: '',
  date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  readTime: '5 min read',
  likes: 0,
  comments: 0,
  topics: [],
  seo: {
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogImage: '',
  },
};

const PostEditor = ({ post, onSubmit, onCancel, isLoading }: PostEditorProps) => {
  const initialData = post || defaultPostData;
  
  const [formData, setFormData] = useState({
    ...initialData,
    seo: initialData.seo || defaultPostData.seo,
    topics: initialData.topics || defaultPostData.topics,
  });
  
  const [activeTab, setActiveTab] = useState('content');
  const [content, setContent] = useState(initialData.content || '');
  const [mediaItems, setMediaItems] = useState<Array<{type: string, url: string}>>([]);
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });
  
  const { data: topics } = useQuery({
    queryKey: ['topics'],
    queryFn: topicsApi.getAll,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('seo.')) {
      const seoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };
  
  const handleTopicsChange = (selectedTopics: string[]) => {
    setFormData(prev => ({
      ...prev,
      topics: selectedTopics
    }));
  };
  
  const handleCoverImageChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      coverImage: url
    }));
  };
  
  const handleSlugGenerate = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    setFormData(prev => ({
      ...prev,
      slug
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine all data for submission
    const completeFormData = {
      ...formData,
      content,
      mediaItems,
    };
    
    onSubmit(completeFormData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{post ? 'Edit Post' : 'Create New Post'}</h2>
        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {post ? 'Update Post' : 'Publish Post'}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="flex-1"
                      required
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleSlugGenerate}
                      className="whitespace-nowrap"
                    >
                      Generate from Title
                    </Button>
                  </div>
                </div>
                
                <div className="w-1/3">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="mt-1">
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
              
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="mt-1"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label>Content</Label>
                <div className="mt-1 border rounded-md">
                  <RichTextEditor 
                    initialValue={content} 
                    onChange={setContent} 
                    onAddMedia={(media) => setMediaItems([...mediaItems, media])}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <MediaUploader 
                currentImage={formData.coverImage} 
                onImageSelected={handleCoverImageChange}
              />
              
              <div className="mt-6">
                <Label>Current Media In Post</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {mediaItems.map((item, index) => (
                    <div key={index} className="border rounded-md p-2">
                      {item.type === 'image' ? (
                        <img src={item.url} alt="" className="w-full h-32 object-cover rounded" />
                      ) : (
                        <div className="flex items-center justify-center h-32 bg-muted rounded">
                          <Video className="h-10 w-10 opacity-50" />
                        </div>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 w-full"
                        onClick={() => {
                          const newItems = [...mediaItems];
                          newItems.splice(index, 1);
                          setMediaItems(newItems);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  name="seo.metaTitle"
                  value={formData.seo?.metaTitle}
                  onChange={handleChange}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 50-60 characters
                </p>
              </div>
              
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  name="seo.metaDescription"
                  value={formData.seo?.metaDescription}
                  onChange={handleChange}
                  className="mt-1"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 150-160 characters
                </p>
              </div>
              
              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Textarea
                  id="keywords"
                  name="seo.keywords"
                  value={formData.seo?.keywords}
                  onChange={handleChange}
                  className="mt-1"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate keywords with commas
                </p>
              </div>
              
              <div>
                <Label htmlFor="ogImage">Open Graph Image</Label>
                <Input
                  id="ogImage"
                  name="seo.ogImage"
                  value={formData.seo?.ogImage}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="URL to image for social media sharing"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="topics">Topics/Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {topics?.map(topic => (
                    <Button
                      key={topic.id}
                      type="button"
                      variant={formData.topics?.includes(topic.name) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newTopics = formData.topics?.includes(topic.name)
                          ? formData.topics.filter(t => t !== topic.name)
                          : [...(formData.topics || []), topic.name];
                        handleTopicsChange(newTopics);
                      }}
                    >
                      <Hash className="mr-1 h-3 w-3" />
                      {topic.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="5 min read"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Publication Date</Label>
                  <Input
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    name="author.name"
                    value={formData.author?.name}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        author: {
                          ...prev.author,
                          name: e.target.value
                        }
                      }));
                    }}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default PostEditor;
