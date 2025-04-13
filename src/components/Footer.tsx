
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Loader2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { subscribeToNewsletter } from '@/api/mailchimpService';
import { saveSubscriber } from '@/models/Newsletter';

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Subscribe to Mailchimp
      const result = await subscribeToNewsletter({ email });
      
      // Save to MongoDB regardless of Mailchimp result
      // This ensures we have a backup of subscribers
      await saveSubscriber({ email });
      
      if (result.success) {
        setIsSuccess(true);
        toast({
          title: "Subscription Successful",
          description: result.message,
        });
        
        // Reset success state after 3 seconds
        setTimeout(() => setIsSuccess(false), 3000);
        setEmail('');
      } else {
        toast({
          title: "Subscription Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription Error",
        description: "An error occurred while subscribing. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-custom-green text-custom-green-light">
      <div className="container-custom py-12">
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-custom-green-light/20 mb-8 gap-6">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-2">Join Our Newsletter</h3>
            <p className="text-custom-green-light/80">
              Get travel inspiration, tips and exclusive offers sent straight to your inbox
            </p>
          </div>
          <div className="md:w-1/2">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-custom-green-light/10 border-custom-green-light/20 text-custom-green-light placeholder:text-custom-green-light/50 focus-visible:ring-custom-green-light/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || isSuccess}
              />
              <Button 
                type="submit"
                className="bg-custom-green-light hover:bg-custom-green-light/90 text-custom-green min-w-[120px]"
                disabled={isSubmitting || isSuccess}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isSuccess ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Subscribed!
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-xl mb-4">NomadJourney</h4>
            <p className="text-custom-green-light/70 mb-4">
              Inspiring authentic travel experiences and connecting explorers from around the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-custom-green-light/80 hover:text-custom-green-light">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-custom-green-light/80 hover:text-custom-green-light">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-custom-green-light/80 hover:text-custom-green-light">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-custom-green-light/80 hover:text-custom-green-light">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-custom-green-light/80 hover:text-custom-green-light">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-custom-green-light/80 hover:text-custom-green-light">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-custom-green-light/80 hover:text-custom-green-light">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-custom-green-light/80 hover:text-custom-green-light">
                  Travel Events
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Information</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-custom-green-light/80 hover:text-custom-green-light">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-custom-green-light/80 hover:text-custom-green-light">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-custom-green-light/80 hover:text-custom-green-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-custom-green-light/80 hover:text-custom-green-light">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-custom-green-light/80">
                <Mail className="h-4 w-4 mr-2" />
                <span>hello@nomadjourney.com</span>
              </li>
              <li className="text-custom-green-light/80">
                123 Adventure Road,<br />
                Travelers Valley, TX 12345
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-6 border-t border-custom-green-light/20 text-center text-custom-green-light/60 text-sm">
          <p>&copy; {new Date().getFullYear()} NomadJourney. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
