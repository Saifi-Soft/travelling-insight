import { useState } from 'react';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, Calendar, MessageSquare, UserPlus, Users, Search, Clock, ThumbsUp } from 'lucide-react';

type TravelBuddy = {
  id: number;
  name: string;
  avatar: string;
  location: string;
  bio: string;
  interests: string[];
  destinations: string[];
  travelDates: string;
};

type Discussion = {
  id: number;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  replies: number;
  likes: number;
  tags: string[];
};

const TRAVEL_BUDDIES: TravelBuddy[] = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=11",
    location: "San Francisco, USA",
    bio: "Adventure enthusiast seeking companions for hiking trips and cultural explorations in Southeast Asia.",
    interests: ["Hiking", "Photography", "Local Cuisine"],
    destinations: ["Thailand", "Vietnam", "Cambodia"],
    travelDates: "Aug 15 - Sep 30, 2025"
  },
  {
    id: 2,
    name: "Sophia Chen",
    avatar: "https://i.pravatar.cc/150?img=5",
    location: "Toronto, Canada",
    bio: "Digital nomad looking for fellow remote workers to share accommodations and experiences in European cities.",
    interests: ["City Life", "Working Remotely", "Cafes"],
    destinations: ["Portugal", "Spain", "Italy"],
    travelDates: "Oct 1 - Dec 20, 2025"
  },
  {
    id: 3,
    name: "Miguel Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=12",
    location: "Mexico City, Mexico",
    bio: "Foodie and history buff planning a road trip through South America. Looking for 1-2 companions to share costs and driving.",
    interests: ["Food", "History", "Road Trips"],
    destinations: ["Argentina", "Chile", "Peru"],
    travelDates: "Jan 10 - Mar 15, 2026"
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?img=9",
    location: "Melbourne, Australia",
    bio: "Marine biology student planning to explore coral reefs. Seeking diving buddies with at least intermediate experience.",
    interests: ["Diving", "Marine Life", "Conservation"],
    destinations: ["Great Barrier Reef", "Indonesia", "Philippines"],
    travelDates: "Nov 5 - Dec 10, 2025"
  }
];

const DISCUSSIONS: Discussion[] = [
  {
    id: 1,
    title: "Best time to visit Patagonia?",
    excerpt: "I'm planning a hiking trip to Patagonia and wondering when the weather is ideal. Any experiences or recommendations?",
    author: {
      name: "Hiking Enthusiast",
      avatar: "https://i.pravatar.cc/150?img=15"
    },
    date: "2 days ago",
    replies: 24,
    likes: 18,
    tags: ["Patagonia", "Hiking", "Weather"]
  },
  {
    id: 2,
    title: "Solo female traveler safety tips for Morocco",
    excerpt: "I'll be traveling alone through Morocco next month. Looking for safety advice and recommendations from other women who've been there.",
    author: {
      name: "Adventure Girl",
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    date: "1 week ago",
    replies: 37,
    likes: 42,
    tags: ["Morocco", "Solo Travel", "Safety"]
  },
  {
    id: 3,
    title: "Japan Rail Pass - Worth it?",
    excerpt: "Wondering if the JR Pass is worth purchasing for a 14-day trip through Japan. Will be visiting Tokyo, Kyoto, Osaka, and Hiroshima.",
    author: {
      name: "Tokyo Traveler",
      avatar: "https://i.pravatar.cc/150?img=17"
    },
    date: "3 days ago",
    replies: 19,
    likes: 15,
    tags: ["Japan", "Transportation", "Budget"]
  },
  {
    id: 4,
    title: "Must-try street foods in Bangkok",
    excerpt: "Heading to Bangkok next month and want to experience the best street food. Any recommendations on what to try and where to find it?",
    author: {
      name: "Foodie Explorer",
      avatar: "https://i.pravatar.cc/150?img=22"
    },
    date: "5 days ago",
    replies: 28,
    likes: 34,
    tags: ["Bangkok", "Food", "Street Food"]
  }
];

const Community = () => {
  const [likedDiscussions, setLikedDiscussions] = useState<number[]>([]);

  // Function to handle button clicks that aren't fully implemented yet
  const handleFeatureNotAvailable = (featureName: string) => {
    toast(`The "${featureName}" feature will be available soon!`, {
      description: "We're working hard to bring this functionality to you.",
    });
  };

  // Function to handle likes
  const handleLikeDiscussion = (discussionId: number) => {
    if (likedDiscussions.includes(discussionId)) {
      setLikedDiscussions(likedDiscussions.filter(id => id !== discussionId));
      toast("You unliked this discussion");
    } else {
      setLikedDiscussions([...likedDiscussions, discussionId]);
      toast("You liked this discussion");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
          
          <div className="container-custom relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 px-3 py-1 border-primary text-primary">
                Connect
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Join Our Travel Community
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Connect with fellow travelers, find travel buddies, share experiences, and get answers to your travel questions
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => handleFeatureNotAvailable("Join Community")}
                >
                  <Users className="mr-2 h-5 w-5" /> Join Community
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => handleFeatureNotAvailable("Browse Forums")}
                >
                  <Search className="mr-2 h-5 w-5" /> Browse Forums
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Community Content */}
        <section className="py-16">
          <div className="container-custom">
            <Tabs defaultValue="buddies" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-background border border-border">
                  <TabsTrigger value="buddies" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <UserPlus className="h-4 w-4 mr-2" /> Find Travel Buddies
                  </TabsTrigger>
                  <TabsTrigger value="discussions" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <MessageSquare className="h-4 w-4 mr-2" /> Discussions
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Travel Buddies Tab */}
              <TabsContent value="buddies" className="mt-0">
                <div className="flex flex-col items-center text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Find Your Travel Companion</h2>
                  <p className="text-muted-foreground max-w-2xl">
                    Connect with like-minded travelers heading to your dream destinations
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {TRAVEL_BUDDIES.map((buddy) => (
                    <Card key={buddy.id} className="overflow-hidden border border-border hover:border-primary/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center mb-4">
                          <Avatar className="h-20 w-20 border-2 border-primary/20">
                            <AvatarImage src={buddy.avatar} alt={buddy.name} />
                            <AvatarFallback>{buddy.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <h3 className="mt-4 text-lg font-semibold">{buddy.name}</h3>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{buddy.location}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {buddy.bio}
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Interested in:</p>
                            <div className="flex flex-wrap gap-1">
                              {buddy.interests.map((interest, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Destinations:</p>
                            <div className="flex flex-wrap gap-1">
                              {buddy.destinations.map((destination, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-primary/30 text-primary">
                                  {destination}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 text-primary mr-1" />
                            <p className="text-xs">{buddy.travelDates}</p>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="bg-muted/30 px-6 py-3">
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={() => handleFeatureNotAvailable(`Connect with ${buddy.name}`)}
                        >
                          Connect
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Discussions Tab */}
              <TabsContent value="discussions" className="mt-0">
                <div className="flex flex-col items-center text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Popular Discussions</h2>
                  <p className="text-muted-foreground max-w-2xl">
                    Join the conversation, ask questions, and share your travel wisdom
                  </p>
                </div>
                
                <div className="grid gap-6">
                  {DISCUSSIONS.map((discussion) => (
                    <Card key={discussion.id} className="overflow-hidden hover:border-primary/30 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                            <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <h3 
                              className="text-lg font-semibold mb-1 hover:text-primary transition-colors cursor-pointer"
                              onClick={() => handleFeatureNotAvailable(`View "${discussion.title}" discussion`)}
                            >
                              {discussion.title}
                            </h3>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                              <span>{discussion.author.name}</span>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{discussion.date}</span>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground mb-3">
                              {discussion.excerpt}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {discussion.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <div 
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleFeatureNotAvailable(`View replies for "${discussion.title}"`)}
                              >
                                <MessageSquare className="h-4 w-4 text-primary" />
                                <span>{discussion.replies} replies</span>
                              </div>
                              <div 
                                className={`flex items-center gap-1 cursor-pointer ${likedDiscussions.includes(discussion.id) ? 'text-accent font-medium' : ''}`}
                                onClick={() => handleLikeDiscussion(discussion.id)}
                              >
                                <ThumbsUp className={`h-4 w-4 ${likedDiscussions.includes(discussion.id) ? 'text-accent fill-accent' : 'text-accent'}`} />
                                <span>
                                  {likedDiscussions.includes(discussion.id) 
                                    ? discussion.likes + 1 
                                    : discussion.likes} likes
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => handleFeatureNotAvailable("Start a New Discussion")}
                  >
                    <Globe className="mr-2 h-5 w-5" /> Start a New Discussion
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
