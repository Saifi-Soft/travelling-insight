import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TravelSearch from '@/components/travel/TravelSearch';
import { Plane, Hotel, MapPin, CalendarClock, HelpingHand, Briefcase, PackageCheck, Globe, Star, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BetweenPostsAd from '@/components/ads/BetweenPostsAd';
import VerticalAd from '@/components/ads/VerticalAd';
import PopupAd from '@/components/ads/PopupAd';

const TravelPlanner = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Mock destinations for featured section
  const featuredDestinations = [
    {
      name: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9357976b82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      description: 'Explore the city of love and its iconic landmarks',
    },
    {
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2338&q=80',
      description: 'Discover tropical paradise and vibrant culture',
    },
    {
      name: 'Tokyo, Japan',
      image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2336&q=80',
      description: 'Experience the perfect blend of tradition and innovation',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-primary/20 to-background py-16 lg:py-24">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')] bg-cover bg-center opacity-20"></div>
          
          <div className="container-custom relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Plan Your Dream Trip</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Search, compare and book flights, hotels, and tour guides all in one place.
                We'll help you create the perfect travel experience.
              </p>
            </div>
          </div>
        </div>

        {/* Travel Planner Steps */}
        <div className="container-custom py-12">
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center">
              <div className={`rounded-full w-10 h-10 flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'border border-gray-300 text-gray-500'}`}>1</div>
              <div className={`h-1 w-16 mx-2 ${currentStep > 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`rounded-full w-10 h-10 flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-white' : 'border border-gray-300 text-gray-500'}`}>2</div>
              <div className={`h-1 w-16 mx-2 ${currentStep > 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`rounded-full w-10 h-10 flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-white' : 'border border-gray-300 text-gray-500'}`}>3</div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex space-x-8 text-center">
              <div className="flex flex-col items-center">
                <Plane className={`h-6 w-6 mb-2 ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`} />
                <span className={currentStep >= 1 ? 'font-medium' : 'text-gray-500'}>Book Flights</span>
              </div>
              <div className="flex flex-col items-center">
                <Hotel className={`h-6 w-6 mb-2 ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`} />
                <span className={currentStep >= 2 ? 'font-medium' : 'text-gray-500'}>Select Accommodation</span>
              </div>
              <div className="flex flex-col items-center">
                <HelpingHand className={`h-6 w-6 mb-2 ${currentStep >= 3 ? 'text-primary' : 'text-gray-400'}`} />
                <span className={currentStep >= 3 ? 'font-medium' : 'text-gray-500'}>Add Tour Guide</span>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="flights" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="flights" onClick={() => setCurrentStep(1)}>
                    <Plane className="mr-2 h-4 w-4" /> Flights
                  </TabsTrigger>
                  <TabsTrigger value="hotels" onClick={() => setCurrentStep(2)}>
                    <Hotel className="mr-2 h-4 w-4" /> Hotels
                  </TabsTrigger>
                  <TabsTrigger value="guides" onClick={() => setCurrentStep(3)}>
                    <HelpingHand className="mr-2 h-4 w-4" /> Tour Guides
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="flights" className="mt-0">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Find the Best Flights</h3>
                    <p className="text-muted-foreground">Search for the most convenient and affordable flights to your destination.</p>
                  </div>
                  <TravelSearch type="flights" />
                </TabsContent>
                
                <TabsContent value="hotels" className="mt-0">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Find Perfect Accommodations</h3>
                    <p className="text-muted-foreground">Browse hotels, resorts, and vacation rentals for your stay.</p>
                  </div>
                  <TravelSearch type="hotels" />
                </TabsContent>
                
                <TabsContent value="guides" className="mt-0">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Book Expert Local Guides</h3>
                    <p className="text-muted-foreground">Enhance your trip with knowledgeable local guides who can show you the best experiences.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-grow">
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                          placeholder="Where do you need a guide?" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <CalendarClock className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-grow">
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                          placeholder="When do you need a guide?" 
                        />
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      <Search className="mr-2 h-4 w-4" /> Find Tour Guides
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* First Advertisement - After the main planning section */}
        <BetweenPostsAd />

        {/* How It Works Section */}
        <div className="bg-secondary/30 py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose Destination</h3>
                <p className="text-muted-foreground">Select from hundreds of amazing destinations worldwide.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Book Travel & Stay</h3>
                <p className="text-muted-foreground">Find the perfect flights and accommodations for your trip.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <HelpingHand className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Add Local Guide</h3>
                <p className="text-muted-foreground">Enhance your experience with local expertise and insider knowledge.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <PackageCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enjoy Your Trip</h3>
                <p className="text-muted-foreground">Relax and enjoy your perfectly planned travel experience.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Destinations */}
        <div className="container-custom py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Destinations</h2>
            <Button variant="outline" onClick={() => navigate('/destinations')}>
              View All Destinations
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((destination, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{destination.name}</CardTitle>
                  <CardDescription>{destination.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-2 text-sm text-muted-foreground">(120+ reviews)</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate('/destinations')}>
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Second Advertisement - Before testimonials */}
        <BetweenPostsAd variant="compact" />

        {/* Testimonials */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">What Travelers Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-card shadow-md">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="italic mb-4">"The all-in-one booking system made planning our family vacation so easy. We booked everything in one place and saved hours of research!"</p>
                  <Separator className="my-4" />
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">JD</div>
                    <div>
                      <p className="font-medium">Jessica Daniels</p>
                      <p className="text-sm text-muted-foreground">Family Traveler</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card shadow-md">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="italic mb-4">"The local guide feature was a game-changer. Our guide took us to hidden spots we would never have found on our own. Best travel decision ever!"</p>
                  <Separator className="my-4" />
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">MK</div>
                    <div>
                      <p className="font-medium">Michael Kim</p>
                      <p className="text-sm text-muted-foreground">Adventure Seeker</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card shadow-md">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="italic mb-4">"I was able to plan, book, and organize my entire European tour without ever leaving the site. The prices were competitive and the process was seamless."</p>
                  <Separator className="my-4" />
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">AL</div>
                    <div>
                      <p className="font-medium">Amelia Lawson</p>
                      <p className="text-sm text-muted-foreground">Business Traveler</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Vertical Ad */}
      <VerticalAd position="right" />
      
      {/* Popup Ad - shown after 5 seconds with auto-close after 10 seconds */}
      <PopupAd delay={5000} duration={10000} />
    </div>
  );
};

export default TravelPlanner;
