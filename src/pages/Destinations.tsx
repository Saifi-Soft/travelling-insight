import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Info, ArrowRight } from 'lucide-react';
import HeaderAd from '@/components/ads/HeaderAd';
import FooterAd from '@/components/ads/FooterAd';

type Destination = {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  featured?: boolean;
  tags: string[];
};

const DESTINATIONS: Destination[] = [
  {
    id: 1,
    name: "Santorini",
    location: "Greece",
    description: "Famous for its stunning sunsets, white-washed buildings and blue-domed churches perched on cliffs above the Aegean Sea.",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80",
    rating: 4.8,
    featured: true,
    tags: ["Islands", "Views", "Romantic"]
  },
  {
    id: 2,
    name: "Kyoto",
    location: "Japan",
    description: "The cultural heart of Japan featuring ancient temples, traditional wooden houses, and beautiful gardens.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 4.7,
    tags: ["Historical", "Culture", "Temples"]
  },
  {
    id: 3,
    name: "Marrakech",
    location: "Morocco",
    description: "A vibrant city known for its bustling souks, historic palaces, and the famous Djemaa el-Fna square.",
    image: "https://images.unsplash.com/photo-1597212618204-352ed04ae469?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 4.5,
    tags: ["Markets", "Culture", "Food"]
  },
  {
    id: 4,
    name: "Machu Picchu",
    location: "Peru",
    description: "The ancient Incan citadel set high in the Andes Mountains, offering breathtaking views and archaeological wonders.",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1177&q=80",
    rating: 4.9,
    featured: true,
    tags: ["Archaeological", "Mountains", "Nature"]
  },
  {
    id: 5,
    name: "Bali",
    location: "Indonesia",
    description: "Island paradise known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80",
    rating: 4.6,
    tags: ["Beaches", "Temples", "Nature"]
  },
  {
    id: 6,
    name: "Grand Canyon",
    location: "United States",
    description: "A steep-sided canyon carved by the Colorado River, known for its visually overwhelming size and intricate landscape.",
    image: "https://images.unsplash.com/photo-1527333656061-ca7adf608ae1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80",
    rating: 4.8,
    tags: ["Natural Wonder", "Hiking", "Views"]
  },
  {
    id: 7,
    name: "Prague",
    location: "Czech Republic",
    description: "The 'City of a Hundred Spires' is known for its Old Town Square, colorful baroque buildings, and medieval Astronomical Clock.",
    image: "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    rating: 4.7,
    tags: ["Architecture", "Historical", "City"]
  },
  {
    id: 8,
    name: "Serengeti",
    location: "Tanzania",
    description: "Home to the spectacular annual wildebeest migration and an incredible concentration of wildlife.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1168&q=80",
    rating: 4.9,
    featured: true,
    tags: ["Safari", "Wildlife", "Nature"]
  }
];

const Destinations = () => {
  // Get the featured destinations
  const featuredDestinations = DESTINATIONS.filter(dest => dest.featured);
  // Get the rest of the destinations
  const otherDestinations = DESTINATIONS.filter(dest => !dest.featured);
  
  // Function to handle button clicks that aren't fully implemented yet
  const handleFeatureNotAvailable = (featureName: string) => {
    toast(`The "${featureName}" feature will be available soon!`, {
      description: "We're working hard to bring this functionality to you.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeaderAd />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1121&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
          
          <div className="container-custom relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 px-3 py-1 border-primary text-primary">
                Travel the World
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Discover Amazing Destinations
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Explore our curated collection of breathtaking places around the globe that will inspire your next adventure
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => handleFeatureNotAvailable("Explore All Destinations")}
                >
                  Explore All Destinations
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => handleFeatureNotAvailable("View Travel Guides")}
                >
                  View Travel Guides
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Destinations */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom">
            <div className="flex flex-col items-center text-center mb-12">
              <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/50 text-primary">
                Featured
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Must-Visit Destinations</h2>
              <p className="text-muted-foreground max-w-2xl">
                These iconic locations offer unforgettable experiences and should be on every traveler's bucket list
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDestinations.map((destination) => (
                <Card key={destination.id} className="overflow-hidden border-none shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="relative h-64">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm text-foreground rounded-full px-2 py-1 flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                      <span className="text-sm font-medium">{destination.rating}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{destination.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">{destination.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {destination.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-secondary/50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* All Destinations */}
        <section className="py-16">
          <div className="container-custom">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore All Destinations</h2>
              <p className="text-muted-foreground max-w-2xl">
                From bustling cities to remote natural wonders, find your perfect travel destination
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherDestinations.map((destination) => (
                <Card key={destination.id} className="overflow-hidden border-none shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="relative h-48">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground rounded-full px-2 py-1 flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                      <span className="text-xs font-medium">{destination.rating}</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold mb-1">{destination.name}</h3>
                    <div className="flex items-center mb-2">
                      <MapPin className="h-3 w-3 text-primary mr-1" />
                      <span className="text-xs text-muted-foreground">{destination.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{destination.description}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto"
                      onClick={() => handleFeatureNotAvailable(`Learn more about ${destination.name}`)}
                    >
                      Learn more <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/10">
          <div className="container-custom">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to plan your next adventure?</h2>
                <p className="text-muted-foreground">
                  Join our community of travelers for exclusive tips, guides, and travel companions for your next journey
                </p>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white"
                  onClick={() => handleFeatureNotAvailable("Get Travel Advice")}
                >
                  <Info className="mr-2 h-5 w-5" /> Get Travel Advice
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterAd />
      <Footer />
    </div>
  );
};

export default Destinations;
