import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Sun, Moon, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchModal from './SearchModal';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 bg-[#065f46] text-[#f8fafc]`}>
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">NomadJourney</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium hover:text-primary transition-colors relative ${
                location.pathname === "/" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-[#065f46]" : ""
              }`}
            >
              Home
            </Link>
            <Link 
              to="/blog" 
              className={`font-medium hover:text-primary transition-colors relative ${
                location.pathname === "/blog" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-[#065f46]" : ""
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/destinations" 
              className={`font-medium hover:text-primary transition-colors relative ${
                location.pathname === "/destinations" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-[#065f46]" : ""
              }`}
            >
              Destinations
            </Link>
            <Link 
              to="/travel/planner" 
              className={`font-medium hover:text-primary transition-colors relative flex items-center ${
                location.pathname.startsWith("/travel") ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-[#065f46]" : ""
              }`}
            >
              <Plane className="h-4 w-4 mr-1" /> Travel
            </Link>
            <Link 
              to="/community" 
              className={`font-medium hover:text-primary transition-colors relative ${
                location.pathname === "/community" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-[#065f46]" : ""
              }`}
            >
              Community
            </Link>
            <Link 
              to="/about" 
              className={`font-medium hover:text-primary transition-colors relative ${
                location.pathname === "/about" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-[#065f46]" : ""
              }`}
            >
              About
            </Link>
          </div>

          {/* Search, Dark Mode, and User Icons */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={openSearch} className="hover:bg-primary/10">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-primary/10">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="default" className="bg-primary text-white hover:bg-primary/90 ml-2 rounded-full px-6">
              Sign In
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={openSearch}
              className="mr-2 hover:bg-primary/10"
            >
              <Search className="h-5 w-5" />
            </Button>
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
                className={`font-medium hover:text-primary transition-colors py-2 ${location.pathname === "/" ? "text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/blog" 
                className={`font-medium hover:text-primary transition-colors py-2 ${location.pathname === "/blog" ? "text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/destinations" 
                className={`font-medium hover:text-primary transition-colors py-2 ${location.pathname === "/destinations" ? "text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Destinations
              </Link>
              <Link 
                to="/travel/planner" 
                className={`font-medium hover:text-primary transition-colors py-2 flex items-center ${location.pathname.startsWith("/travel") ? "text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Plane className="h-4 w-4 mr-1" /> Travel
              </Link>
              <Link 
                to="/community" 
                className={`font-medium hover:text-primary transition-colors py-2 ${location.pathname === "/community" ? "text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/about" 
                className={`font-medium hover:text-primary transition-colors py-2 ${location.pathname === "/about" ? "text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" size="sm" className="w-1/2 mr-2" onClick={() => {openSearch(); setIsMenuOpen(false);}}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="default" size="sm" className="w-1/2 bg-primary rounded-full">
                  Sign In
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="mt-2 w-full justify-center" onClick={toggleTheme}>
                {isDarkMode ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    <span>Dark Mode</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </nav>
  );
};

export default Navbar;
