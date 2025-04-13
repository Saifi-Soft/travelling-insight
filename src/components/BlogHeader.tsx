
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

interface BlogHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
  isTrending?: boolean;
}

const BlogHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  activeCategory, 
  setActiveCategory,
  categories,
  isTrending = false
}: BlogHeaderProps) => {
  return (
    <>
      {/* Hero Banner with improved background and reduced opacity */}
      <div className="bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center relative text-white py-20 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-custom-green/30 to-custom-green/20"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              {isTrending ? "Trending Articles" : "Travel Blog"}
            </h1>
            <p className="text-lg opacity-90">
              {isTrending 
                ? "Discover what's hot and happening in the travel world" 
                : "Stories, guides, and insights from travelers around the world"}
            </p>
          </div>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="container-custom pb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-custom-green" />
            <Input 
              type="search" 
              placeholder="Search articles..." 
              className="pl-10 border-custom-green/30 focus:border-custom-green"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-custom-green" />
            <span className="text-sm font-medium text-custom-green">Filter:</span>
          </div>
          
          <div className="flex overflow-x-auto gap-2 pb-1 w-full md:w-auto">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant={activeCategory === category ? "default" : "outline"}
                className={`cursor-pointer py-1.5 px-3 ${
                  category === "Culture" ? "bg-[#9b87f5] hover:bg-[#9b87f5]/90 text-white" : 
                  category === "Beaches" ? "bg-blue-600 hover:bg-blue-700 text-white" : 
                  activeCategory === category ? "" : "hover:bg-custom-green/10"
                }`}
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
