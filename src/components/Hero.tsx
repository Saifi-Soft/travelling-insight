
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/20 to-background py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')] bg-cover bg-center opacity-20"></div>
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter max-w-3xl">
              Discover the World Through Travelers' Eyes
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
              Join our community of passionate explorers sharing authentic stories, tips, and experiences from around the globe.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/blog">Start Exploring</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
              <Link to="/community">Join Community</Link>
            </Button>
          </div>
          
          <div className="pt-6 flex items-center justify-center space-x-6">
            <div className="text-center">
              <p className="text-3xl font-bold">1000+</p>
              <p className="text-sm text-muted-foreground">Travel Stories</p>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="text-center">
              <p className="text-3xl font-bold">120+</p>
              <p className="text-sm text-muted-foreground">Destinations</p>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="text-center">
              <p className="text-3xl font-bold">50k+</p>
              <p className="text-sm text-muted-foreground">Community Members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
