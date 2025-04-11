
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Upload } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const AdminCreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('content');
  
  // Form state
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [excerpt, setExcerpt] = React.useState('');
  const [content, setContent] = React.useState('');
  const [date, setDate] = React.useState<Date>(new Date());
  const [coverImage, setCoverImage] = React.useState('');
  const [readTime, setReadTime] = React.useState('5');
  const [featured, setFeatured] = React.useState(false);
  const [mediaItems, setMediaItems] = React.useState<any[]>([]);
  
  const [categories, setCategories] = React.useState({
    adventure: false,
    food: false,
    relaxation: false,
    cultural: false,
    nature: false,
    urban: false
  });

  // SEO fields
  const [seo, setSeo] = React.useState({
    metaTitle: '',
    metaDescription: '',
    keywords: ''
  });

  // Generate slug from title
  React.useEffect(() => {
    if (title) {
      setSlug(title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  }, [title]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleImageSelected = (url: string) => {
    setCoverImage(url);
  };

  const handleAddMedia = (media: { type: string, url: string }) => {
    setMediaItems([...mediaItems, media]);
  };

  const handleCreatePost = () => {
    // Validate required fields
    if (!title || !excerpt || !coverImage) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would call an API to create the post
    toast({
      title: "Success",
      description: "Post created successfully",
    });

    // Navigate back to posts list
    navigate('/admin/posts');
  };
  
  const handleCancel = () => {
    navigate('/admin/posts');
  };

  return (
    <AdminLayout activeItem="posts">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title"
                    className="text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="excerpt" className="text-sm font-medium">Excerpt</label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief summary of the post"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">Content</label>
                  <div className="border rounded-md overflow-hidden">
                    <RichTextEditor
                      initialValue={content}
                      onChange={handleContentChange}
                      onAddMedia={handleAddMedia}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Cover Image</h3>
                  <p className="text-sm text-gray-500">Add a cover image for your post</p>
                  
                  <div className="mt-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {coverImage ? (
                        <div className="relative">
                          <img 
                            src={coverImage} 
                            alt="Cover" 
                            className="mx-auto max-h-[300px] object-contain"
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null;
                              currentTarget.src = "https://via.placeholder.com/800x400?text=Invalid+Image+URL";
                            }}
                          />
                          <Button 
                            variant="destructive" 
                            className="absolute top-2 right-2"
                            onClick={() => setCoverImage('')}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Drag and drop an image, or click to browse</p>
                          <div className="mt-4">
                            <input
                              type="text"
                              placeholder="Or enter an image URL"
                              className="w-full p-2 border rounded-md"
                              onChange={(e) => setCoverImage(e.target.value)}
                            />
                          </div>
                          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                            Upload Image
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="seo" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="slug" className="text-sm font-medium">URL Slug</label>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">/post/</span>
                        <Input
                          id="slug"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="post-url-slug"
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Leave empty to auto-generate from title</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="meta-title" className="text-sm font-medium">Meta Title</label>
                      <Input
                        id="meta-title"
                        value={seo.metaTitle}
                        onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                        placeholder="SEO-optimized title (optional)"
                      />
                      <p className="text-xs text-gray-500">If left empty, the post title will be used</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="meta-description" className="text-sm font-medium">Meta Description</label>
                      <Textarea
                        id="meta-description"
                        value={seo.metaDescription}
                        onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                        placeholder="SEO description (optional)"
                        className="min-h-[80px]"
                      />
                      <p className="text-xs text-gray-500">If left empty, the post excerpt will be used</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="keywords" className="text-sm font-medium">Keywords</label>
                      <Input
                        id="keywords"
                        value={seo.keywords}
                        onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                        placeholder="travel, asia, guide, etc."
                      />
                      <p className="text-xs text-gray-500">Comma-separated keywords for search engines</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Post Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="publication-date" className="text-sm font-medium">Publication Date</label>
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
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => date && setDate(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Categories</label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="adventure"
                            checked={categories.adventure}
                            onCheckedChange={(checked) => setCategories({...categories, adventure: checked as boolean})}
                          />
                          <label htmlFor="adventure" className="text-sm">Adventure</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="cultural"
                            checked={categories.cultural}
                            onCheckedChange={(checked) => setCategories({...categories, cultural: checked as boolean})}
                          />
                          <label htmlFor="cultural" className="text-sm">Cultural</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="food"
                            checked={categories.food}
                            onCheckedChange={(checked) => setCategories({...categories, food: checked as boolean})}
                          />
                          <label htmlFor="food" className="text-sm">Food & Cuisine</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="nature"
                            checked={categories.nature}
                            onCheckedChange={(checked) => setCategories({...categories, nature: checked as boolean})}
                          />
                          <label htmlFor="nature" className="text-sm">Nature</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="relaxation"
                            checked={categories.relaxation}
                            onCheckedChange={(checked) => setCategories({...categories, relaxation: checked as boolean})}
                          />
                          <label htmlFor="relaxation" className="text-sm">Relaxation</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="urban"
                            checked={categories.urban}
                            onCheckedChange={(checked) => setCategories({...categories, urban: checked as boolean})}
                          />
                          <label htmlFor="urban" className="text-sm">Urban</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="read-time" className="text-sm font-medium">Read Time (minutes)</label>
                      <Input
                        id="read-time"
                        type="number"
                        min="1"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="featured" 
                        checked={featured}
                        onCheckedChange={setFeatured}
                      />
                      <label htmlFor="featured" className="text-sm font-medium">Featured Post</label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreatePost}>
            Create Post
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreatePost;
