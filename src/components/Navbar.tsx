
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
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const location = useLocation();

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
    <nav className={`sticky top-0 z-50 transition-all duration-300 bg-theme-header text-theme-foreground`}>
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">NomadJourney</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium hover:text-theme-primary transition-colors relative ${
                location.pathname === "/" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-theme-primary" : ""
              }`}
            >
              Home
            </Link>
            <Link 
              to="/blog" 
              className={`font-medium hover:text-theme-primary transition-colors relative ${
                location.pathname === "/blog" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-theme-primary" : ""
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/destinations" 
              className={`font-medium hover:text-theme-primary transition-colors relative ${
                location.pathname === "/destinations" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-theme-primary" : ""
              }`}
            >
              Destinations
            </Link>
            <Link 
              to="/travel/planner" 
              className={`font-medium hover:text-theme-primary transition-colors relative flex items-center ${
                location.pathname.startsWith("/travel") ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-theme-primary" : ""
              }`}
            >
              <Plane className="h-4 w-4 mr-1" /> Travel
            </Link>
            <Link 
              to="/community" 
              className={`font-medium hover:text-theme-primary transition-colors relative ${
                location.pathname === "/community" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-theme-primary" : ""
              }`}
            >
              Community
            </Link>
            <Link 
              to="/about" 
              className={`font-medium hover:text-theme-primary transition-colors relative ${
                location.pathname === "/about" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-theme-primary" : ""
              }`}
            >
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={openSearch} className="hover:bg-theme-primary/10">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-theme-primary/10">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/login">
              <Button variant="default" className="bg-theme-primary text-white hover:bg-theme-primary/90 ml-2 rounded-full px-6">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={openSearch}
              className="mr-2 hover:bg-theme-primary/10"
            >
              <Search className="h-5 w-5" />
            </Button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-theme-primary/10"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`font-medium hover:text-theme-primary transition-colors py-2 ${location.pathname === "/" ? "text-theme-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/blog" 
                className={`font-medium hover:text-theme-primary transition-colors py-2 ${location.pathname === "/blog" ? "text-theme-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/destinations" 
                className={`font-medium hover:text-theme-primary transition-colors py-2 ${location.pathname === "/destinations" ? "text-theme-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Destinations
              </Link>
              <Link 
                to="/travel/planner" 
                className={`font-medium hover:text-theme-primary transition-colors py-2 flex items-center ${location.pathname.startsWith("/travel") ? "text-theme-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Plane className="h-4 w-4 mr-1" /> Travel
              </Link>
              <Link 
                to="/community" 
                className={`font-medium hover:text-theme-primary transition-colors py-2 ${location.pathname === "/community" ? "text-theme-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/about" 
                className={`font-medium hover:text-theme-primary transition-colors py-2 ${location.pathname === "/about" ? "text-theme-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" size="sm" className="w-1/2 mr-2 border-theme-primary text-theme-primary" onClick={() => {openSearch(); setIsMenuOpen(false);}}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Link to="/login" className="w-1/2">
                  <Button variant="default" size="sm" className="w-full bg-theme-primary text-white rounded-full">
                    Sign In
                  </Button>
                </Link>
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
      
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </nav>
  );
};

export default Navbar;
