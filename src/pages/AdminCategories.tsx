
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
}

const AdminCategories = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Mock categories data
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Adventure',
      slug: 'adventure',
      description: 'Explore thrilling and adrenaline-pumping travel experiences.',
      image: 'https://example.com/adventure.jpg',
      count: 10
    },
    {
      id: '2',
      name: 'Cultural',
      slug: 'cultural',
      description: 'Immerse yourself in the rich cultures and traditions of different destinations.',
      image: 'https://example.com/cultural.jpg',
      count: 8
    },
    {
      id: '3',
      name: 'Food & Cuisine',
      slug: 'food-cuisine',
      description: 'Savor the flavors of the world with unique culinary experiences.',
      image: 'https://example.com/food.jpg',
      count: 12
    },
    {
      id: '4',
      name: 'Nature',
      slug: 'nature',
      description: 'Connect with the natural world through breathtaking landscapes and wildlife.',
      image: 'https://example.com/nature.jpg',
      count: 15
    },
    {
      id: '5',
      name: 'Relaxation',
      slug: 'relaxation',
      description: 'Unwind and rejuvenate at peaceful and serene destinations.',
      image: 'https://example.com/relaxation.jpg',
      count: 7
    },
    {
      id: '6',
      name: 'Urban',
      slug: 'urban',
      description: 'Explore fascinating cities and urban landscapes around the world.',
      image: 'https://example.com/urban.jpg',
      count: 9
    }
  ]);

  // Add new category form state
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  });

  const handleAddCategory = () => {
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    // Generate an ID (in a real app this would be done by the backend)
    const id = Math.random().toString(36).substr(2, 9);
    
    // Add the new category to the list
    setCategories([...categories, { ...newCategory, id, count: 0 }]);
    
    // Reset the form and close the dialog
    setNewCategory({ name: '', slug: '', description: '', image: '' });
    setIsDialogOpen(false);
    
    // Show success toast
    toast({
      title: "Success",
      description: "Category created successfully",
    });
  };

  return (
    <AdminLayout activeItem="categories">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Categories</h1>
          <Button 
            onClick={handleAddCategory}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="relative h-40 bg-gray-200">
                {category.image && (
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "https://via.placeholder.com/400x200?text=No+Image";
                    }}
                  />
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} posts</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm mt-2 text-gray-600 line-clamp-2">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input 
                id="name" 
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Category name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">Slug</label>
              <Input 
                id="slug" 
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                placeholder="category-slug"
              />
              <p className="text-xs text-gray-500">Leave empty to auto-generate from name</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description" 
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Category description"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">Image URL</label>
              <Input 
                id="image" 
                value={newCategory.image}
                onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategories;
