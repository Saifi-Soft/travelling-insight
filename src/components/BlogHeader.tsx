import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

interface BlogHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
}

const BlogHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  activeCategory, 
  setActiveCategory,
  categories 
}: BlogHeaderProps) => {
  return (
    <>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Travel Blog</h1>
            <p className="text-lg opacity-90">
              Stories, guides, and insights from travelers around the world
            </p>
          </div>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search articles..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          
          <div className="flex overflow-x-auto gap-2 pb-1 w-full md:w-auto">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant={activeCategory === category ? "default" : "outline"}
                className={`cursor-pointer ${activeCategory === category ? "bg-primary" : "hover:bg-primary/10"}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogHeader;
