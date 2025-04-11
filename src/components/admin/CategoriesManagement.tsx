
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Category } from "@/types/common";
import { useToast } from "@/components/ui/use-toast";

// Mock data for categories
const mockCategories: Category[] = [
  { id: "1", name: "Adventure", slug: "adventure", image: "https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6", count: 12, icon: "Mountain" },
  { id: "2", name: "City Life", slug: "city-life", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b", count: 8, icon: "Building" },
  { id: "3", name: "Beach", slug: "beach", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", count: 15, icon: "Umbrella" },
  { id: "4", name: "Food & Drink", slug: "food-drink", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0", count: 20, icon: "Utensils" },
];

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id' | 'count'>>({
    name: "",
    slug: "",
    icon: "",
    image: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Omit<Category, 'id' | 'count'>) => {
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        [field]: e.target.value
      });
    } else {
      setNewCategory({
        ...newCategory,
        [field]: e.target.value
      });
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        name,
        slug
      });
    } else {
      setNewCategory({
        ...newCategory,
        name,
        slug
      });
    }
  };

  const handleAddCategory = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // const response = await apiService.addCategory(newCategory);
      
      // For demo, we'll just add to our local state
      const id = Math.random().toString(36).substring(2, 9);
      const newCategoryWithId: Category = {
        ...newCategory,
        id,
        count: 0
      };
      
      setCategories([...categories, newCategoryWithId]);
      setNewCategory({ name: "", slug: "", icon: "", image: "" });
      
      toast({
        title: "Category added",
        description: "The category has been successfully added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // const response = await apiService.updateCategory(editingCategory.id, editingCategory);
      
      // For demo, we'll just update our local state
      const updatedCategories = categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      );
      
      setCategories(updatedCategories);
      setEditingCategory(null);
      
      toast({
        title: "Category updated",
        description: "The category has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // const response = await apiService.deleteCategory(id);
      
      // For demo, we'll just remove from our local state
      const filteredCategories = categories.filter(cat => cat.id !== id);
      setCategories(filteredCategories);
      
      toast({
        title: "Category deleted",
        description: "The category has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categories Management</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name">Name</label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={handleNameChange}
                  placeholder="Category name"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="slug">Slug</label>
                <Input
                  id="slug"
                  value={newCategory.slug}
                  onChange={(e) => handleInputChange(e, 'slug')}
                  placeholder="category-slug"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="icon">Icon</label>
                <Input
                  id="icon"
                  value={newCategory.icon || ''}
                  onChange={(e) => handleInputChange(e, 'icon')}
                  placeholder="Icon name"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="image">Image URL</label>
                <Input
                  id="image"
                  value={newCategory.image || ''}
                  onChange={(e) => handleInputChange(e, 'image')}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddCategory} disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Category'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category.count}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setEditingCategory(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Category</DialogTitle>
                        </DialogHeader>
                        {editingCategory && (
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label htmlFor="edit-name">Name</label>
                              <Input
                                id="edit-name"
                                value={editingCategory.name}
                                onChange={handleNameChange}
                              />
                            </div>
                            <div className="grid gap-2">
                              <label htmlFor="edit-slug">Slug</label>
                              <Input
                                id="edit-slug"
                                value={editingCategory.slug}
                                onChange={(e) => handleInputChange(e, 'slug')}
                              />
                            </div>
                            <div className="grid gap-2">
                              <label htmlFor="edit-icon">Icon</label>
                              <Input
                                id="edit-icon"
                                value={editingCategory.icon || ''}
                                onChange={(e) => handleInputChange(e, 'icon')}
                              />
                            </div>
                            <div className="grid gap-2">
                              <label htmlFor="edit-image">Image URL</label>
                              <Input
                                id="edit-image"
                                value={editingCategory.image || ''}
                                onChange={(e) => handleInputChange(e, 'image')}
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleUpdateCategory} 
                            disabled={isLoading}
                          >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the category "{category.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteCategory(category.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CategoriesManagement;
