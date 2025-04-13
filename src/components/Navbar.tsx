
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
    <nav className={`sticky top-0 z-50 transition-all duration-300 bg-custom-green text-custom-green-light`}>
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-custom-green-light">NomadJourney</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium hover:text-custom-green-light transition-colors relative ${
                location.pathname === "/" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-custom-green-light" : ""
              }`}
            >
              Home
            </Link>
            <Link 
              to="/blog" 
              className={`font-medium hover:text-custom-green-light transition-colors relative ${
                location.pathname === "/blog" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-custom-green-light" : ""
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/destinations" 
              className={`font-medium hover:text-custom-green-light transition-colors relative ${
                location.pathname === "/destinations" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-custom-green-light" : ""
              }`}
            >
              Destinations
            </Link>
            <Link 
              to="/travel/planner" 
              className={`font-medium hover:text-custom-green-light transition-colors relative flex items-center ${
                location.pathname.startsWith("/travel") ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-custom-green-light" : ""
              }`}
            >
              <Plane className="h-4 w-4 mr-1" /> Travel
            </Link>
            <Link 
              to="/community" 
              className={`font-medium hover:text-custom-green-light transition-colors relative ${
                location.pathname === "/community" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-custom-green-light" : ""
              }`}
            >
              Community
            </Link>
            <Link 
              to="/about" 
              className={`font-medium hover:text-custom-green-light transition-colors relative ${
                location.pathname === "/about" ? "after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-custom-green-light" : ""
              }`}
            >
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={openSearch} className="hover:bg-custom-green-light/10 text-custom-green-light">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-custom-green-light/10 text-custom-green-light">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-custom-green-light/10 text-custom-green-light">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="default" className="bg-custom-green-light text-custom-green hover:bg-custom-green-light/90 ml-2 rounded-full px-6">
              Sign In
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={openSearch}
              className="mr-2 hover:bg-custom-green-light/10 text-custom-green-light"
            >
              <Search className="h-5 w-5" />
            </Button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-custom-green-light hover:bg-custom-green-light/10"
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
                className={`font-medium hover:text-custom-green-light transition-colors py-2 ${location.pathname === "/" ? "text-custom-green-light" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/blog" 
                className={`font-medium hover:text-custom-green-light transition-colors py-2 ${location.pathname === "/blog" ? "text-custom-green-light" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/destinations" 
                className={`font-medium hover:text-custom-green-light transition-colors py-2 ${location.pathname === "/destinations" ? "text-custom-green-light" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Destinations
              </Link>
              <Link 
                to="/travel/planner" 
                className={`font-medium hover:text-custom-green-light transition-colors py-2 flex items-center ${location.pathname.startsWith("/travel") ? "text-custom-green-light" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Plane className="h-4 w-4 mr-1" /> Travel
              </Link>
              <Link 
                to="/community" 
                className={`font-medium hover:text-custom-green-light transition-colors py-2 ${location.pathname === "/community" ? "text-custom-green-light" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/about" 
                className={`font-medium hover:text-custom-green-light transition-colors py-2 ${location.pathname === "/about" ? "text-custom-green-light" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" size="sm" className="w-1/2 mr-2 border-custom-green-light text-custom-green-light" onClick={() => {openSearch(); setIsMenuOpen(false);}}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="default" size="sm" className="w-1/2 bg-custom-green-light text-custom-green rounded-full">
                  Sign In
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="mt-2 w-full justify-center text-custom-green-light" onClick={toggleTheme}>
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
