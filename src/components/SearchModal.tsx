
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, FileText, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Post } from '@/types/common';

// Sample search data (this would ideally come from an API in a real application)
const SEARCH_DATA = {
  posts: [
    {
      id: "1",
      title: "The Hidden Beaches of Thailand",
      category: "Beaches",
      excerpt: "Discover untouched paradises away from the tourist crowds."
    },
    {
      id: "2",
      title: "A Foodie's Guide to Italian Cuisine",
      category: "Food & Drink",
      excerpt: "Beyond pizza and pasta: regional specialties that will transform your understanding of Italian food."
    },
    {
      id: "3",
      title: "Exploring Japan's Ancient Temples",
      category: "Culture",
      excerpt: "A journey through time in the Land of the Rising Sun."
    }
  ],
  destinations: [
    { id: "1", name: "Bali, Indonesia", type: "Island" },
    { id: "2", name: "Paris, France", type: "City" },
    { id: "3", name: "Kyoto, Japan", type: "Historical" }
  ]
};

type SearchResult = {
  posts: Array<{id: string, title: string, category: string, excerpt: string}>;
  destinations: Array<{id: string, name: string, type: string}>;
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ posts: [], destinations: [] });
  const navigate = useNavigate();

  // Handle search query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults({ posts: [], destinations: [] });
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Filter posts based on query
    const filteredPosts = SEARCH_DATA.posts.filter(
      post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.category.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery)
    );

    // Filter destinations based on query
    const filteredDestinations = SEARCH_DATA.destinations.filter(
      dest => 
        dest.name.toLowerCase().includes(lowerQuery) || 
        dest.type.toLowerCase().includes(lowerQuery)
    );

    setResults({
      posts: filteredPosts,
      destinations: filteredDestinations
    });
  }, [query]);

  // Clear search and close modal
  const handleClose = () => {
    setQuery('');
    onClose();
  };
  
  // Handle item click - navigate to the correct page based on the item's ID
  const handleItemClick = (type: string, id: string) => {
    if (type === 'post') {
      console.log(`Navigating to blog post with ID: ${id}`);
      navigate(`/blog/${id}`);
    } else if (type === 'destination') {
      console.log(`Navigating to destination with ID: ${id}`);
      navigate(`/destinations/${id}`);
    }
    handleClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl p-0 overflow-hidden">
        <div className="flex items-center border-b p-4">
          <Search className="h-5 w-5 text-muted-foreground mr-2" />
          <Input 
            className="border-none flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
            placeholder="Search for destinations, articles, or topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="ml-2"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {/* Show results or empty state */}
          {query.trim() === '' ? (
            <div className="text-center py-8 text-muted-foreground">
              Start typing to search...
            </div>
          ) : results.posts.length === 0 && results.destinations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-6">
              {/* Blog post results */}
              {results.posts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Blog Posts</h3>
                  <div className="space-y-3">
                    {results.posts.map(post => (
                      <div
                        key={post.id}
                        onClick={() => handleItemClick('post', post.id)}
                        className="p-3 rounded-md hover:bg-muted transition-colors cursor-pointer flex items-start gap-3"
                      >
                        <FileText className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Destination results */}
              {results.destinations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Destinations</h3>
                  <div className="space-y-3">
                    {results.destinations.map(destination => (
                      <div 
                        key={destination.id}
                        onClick={() => handleItemClick('destination', destination.id)}
                        className="p-3 rounded-md hover:bg-muted transition-colors cursor-pointer flex items-start gap-3"
                      >
                        <MapPin className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">{destination.name}</h4>
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {destination.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
