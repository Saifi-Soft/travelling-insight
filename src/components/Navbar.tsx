
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-background sticky top-0 z-50 shadow-sm">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">NomadJourney</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/blog" className="font-medium hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/destinations" className="font-medium hover:text-primary transition-colors">
              Destinations
            </Link>
            <Link to="/community" className="font-medium hover:text-primary transition-colors">
              Community
            </Link>
            <Link to="/about" className="font-medium hover:text-primary transition-colors">
              About
            </Link>
          </div>

          {/* Search and User Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="default" className="bg-primary text-white hover:bg-primary/90">
              Sign In
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-primary"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/blog" 
                className="font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/destinations" 
                className="font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Destinations
              </Link>
              <Link 
                to="/community" 
                className="font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/about" 
                className="font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" size="sm" className="w-1/2 mr-2">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="default" size="sm" className="w-1/2 bg-primary">
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
