
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-12">
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-white/20 mb-8 gap-6">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-2">Join Our Newsletter</h3>
            <p className="text-white/80">
              Get travel inspiration, tips and exclusive offers sent straight to your inbox
            </p>
          </div>
          <div className="md:w-1/2 flex flex-col sm:flex-row gap-3">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
            />
            <Button className="bg-white text-primary hover:bg-white/90">
              Subscribe
            </Button>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-xl mb-4">NomadJourney</h4>
            <p className="text-white/70 mb-4">
              Inspiring authentic travel experiences and connecting explorers from around the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/80 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-white/80 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-white/80 hover:text-white">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-white/80 hover:text-white">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-white/80 hover:text-white">
                  Travel Events
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Information</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-white/80 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/80 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/80 hover:text-white">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-white/80">
                <Mail className="h-4 w-4 mr-2" />
                <span>hello@nomadjourney.com</span>
              </li>
              <li className="text-white/80">
                123 Adventure Road,<br />
                Travelers Valley, TX 12345
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-6 border-t border-white/20 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} NomadJourney. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
