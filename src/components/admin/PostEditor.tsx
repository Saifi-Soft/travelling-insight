
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Save, X, Image, Link, Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Post, Category, Topic } from '@/types/common';
import RichTextEditor from './RichTextEditor';
import MediaUploader from './MediaUploader';

interface PostEditorProps {
  post?: Post | null;
  onSave: (post: any) => void;
  onCancel: () => void;
}

// Mock categories and topics
const mockCategories: Category[] = [
  { id: '1', name: 'Adventure', slug: 'adventure', image: '', count: 12 },
  { id: '2', name: 'City Life', slug: 'city-life', image: '', count: 8 },
  { id: '3', name: 'Beach', slug: 'beach', image: '', count: 15 },
];

const mockTopics: Topic[] = [
  { id: '1', name: 'Backpacking', slug: 'backpacking', count: 5 },
  { id: '2', name: 'Food Tourism', slug: 'food-tourism', count: 7 },
  { id: '3', name: 'Budget Travel', slug: 'budget-travel', count: 9 },
];

const PostEditor = ({ post, onSave, onCancel }: PostEditorProps) => {
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [coverImage, setCoverImage] = useState(post?.coverImage || '');
  const [category, setCategory] = useState(post?.category || '');
  const [date, setDate] = useState<Date>(post?.date ? new Date(post?.date) : new Date());
  const [content, setContent] = useState(post?.content || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(post?.topics || []);
  const [seo, setSeo] = useState(post?.seo || {
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogImage: ''
  });

  const [activeTab, setActiveTab] = useState('content');
  const { toast } = useToast();

  // Generate slug from title
  useEffect(() => {
    if (!post && title) {
      setSlug(title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  }, [title, post]);

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else {
        return [...prev, topicId];
      }
    });
  };

  const handleSave = () => {
    // Validate required fields
    if (!title || !excerpt || !category || !coverImage) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedPost = {
      id: post?.id || Math.random().toString(36).substr(2, 9),
      title,
      slug,
      excerpt,
      author: post?.author || {
        name: 'Admin User',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User'
      },
      category,
      coverImage,
      date: format(date, 'yyyy-MM-dd'),
      readTime: post?.readTime || `${Math.max(1, Math.ceil(content.length / 1000))} min read`,
      likes: post?.likes || 0,
      comments: post?.comments || 0,
      content,
      topics: selectedTopics,
      seo
    };

    onSave(updatedPost);
    toast({
      title: "Success",
      description: post ? "Post updated successfully" : "Post created successfully",
    });
  };

  // Function to handle content changes from RichTextEditor
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  // Function to handle image selection from MediaUploader
  const handleImageSelected = (url: string) => {
    setCoverImage(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{post ? 'Edit Post' : 'Create New Post'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title"
                />
              </div>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug</label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                />
              </div>
              
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium mb-1">Excerpt *</label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the post"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Category *</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">Publication Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label htmlFor="topics" className="block text-sm font-medium mb-1">Topics</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mockTopics.map((topic) => (
                    <Button
                      key={topic.id}
                      variant={selectedTopics.includes(topic.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTopicToggle(topic.id)}
                      type="button"
                    >
                      {topic.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
                <RichTextEditor onChange={handleContentChange} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-4 mt-4">
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium mb-1">Cover Image URL *</label>
              <div className="flex gap-2">
                <Input
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {coverImage && (
                <div className="mt-2 relative aspect-video rounded-md overflow-hidden">
                  <img 
                    src={coverImage} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Media Gallery</h3>
              <MediaUploader onImageSelected={handleImageSelected} />
            </div>
          </TabsContent>
          
          <TabsContent value="seo" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div>
                <label htmlFor="metaTitle" className="block text-sm font-medium mb-1">Meta Title</label>
                <Input
                  id="metaTitle"
                  value={seo.metaTitle}
                  onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                  placeholder="SEO optimized title"
                />
              </div>
              
              <div>
                <label htmlFor="metaDescription" className="block text-sm font-medium mb-1">Meta Description</label>
                <Textarea
                  id="metaDescription"
                  value={seo.metaDescription}
                  onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                  placeholder="Brief SEO description"
                />
              </div>
              
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium mb-1">Keywords</label>
                <Input
                  id="keywords"
                  value={seo.keywords}
                  onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              
              <div>
                <label htmlFor="ogImage" className="block text-sm font-medium mb-1">OG Image URL</label>
                <Input
                  id="ogImage"
                  value={seo.ogImage}
                  onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                  placeholder="https://example.com/og-image.jpg"
                />
                {seo.ogImage && (
                  <div className="mt-2 relative aspect-video rounded-md overflow-hidden">
                    <img 
                      src={seo.ogImage} 
                      alt="OG Image preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> {post ? 'Update' : 'Create'} Post
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostEditor;
