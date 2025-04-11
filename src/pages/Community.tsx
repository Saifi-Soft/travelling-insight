import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, MapPin, Calendar, MessageSquare, UserPlus, Users, 
  Search, Clock, ThumbsUp, Check, Award, Compass, MapPinned,
  Heart, User, Briefcase, Flag, Camera, Plus, Lock
} from 'lucide-react';
import { 
  communityUsersApi, 
  travelGroupsApi, 
  communityEventsApi,
  travelMatchesApi,
  communityPaymentApi
} from '@/api/communityApiService';
import { format } from 'date-fns';
import { addItemToArray } from '@/utils/arrayUtils';
import SubscriptionModal from '@/components/community/SubscriptionModal';
import IntelligentMatching from '@/components/community/IntelligentMatching';

const Community = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('home');
  
  // States for dialogs and subscription
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Profile and match states
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    experienceLevel: 'Newbie',
    travelStyles: [] as string[],
    interests: [] as string[]
  });
  
  const [matchPreferences, setMatchPreferences] = useState({
    destinations: [] as string[],
    travelStyles: [] as string[],
    interests: [] as string[]
  });
  
  const [userId, setUserId] = useState<string | null>(null);
  const [currentDestination, setCurrentDestination] = useState('');
  const [currentTravelStyle, setCurrentTravelStyle] = useState('');
  const [currentInterest, setCurrentInterest] = useState('');
  
  // Simulate checking if user is logged in & subscribed
  useEffect(() => {
    // This is where you would check if the user is logged in from your auth system
    const mockUserCheck = async () => {
      // In your real implementation, check if the user is authenticated
      const isLoggedIn = localStorage.getItem('community_user_id');
      
      if (isLoggedIn) {
        setUserId(isLoggedIn);
        
        // Check if user has an active subscription
        try {
          const hasSubscription = await communityPaymentApi.checkSubscriptionStatus(isLoggedIn);
          setIsSubscribed(hasSubscription);
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      }
    };
    
    mockUserCheck();
  }, []);
  
  // Fetch community data
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['communityUsers'],
    queryFn: () => communityUsersApi.getAll(),
  });
  
  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['travelGroups'],
    queryFn: () => travelGroupsApi.getAll(),
  });
  
  const { data: events = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ['communityEvents'],
    queryFn: () => communityEventsApi.getAll(),
  });
  
  // Filter active and featured data
  const activeUsers = users.filter(user => user.status === 'active');
  const featuredGroups = groups
    .filter(group => group.status === 'active' && group.featuredStatus)
    .slice(0, 4);
  const upcomingEvents = events
    .filter(event => event.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  // Function to handle protected features
  const handleProtectedAction = (actionCallback: () => void, featureName: string = '') => {
    if (!userId) {
      toast.error('Please log in to continue', {
        description: 'Create an account or log in to access this feature'
      });
      return;
    }
    
    if (!isSubscribed) {
      toast.error('Premium feature', {
        description: `Subscribe to access ${featureName || 'all community features'}`
      });
      setIsSubscriptionModalOpen(true);
      return;
    }
    
    actionCallback();
  };
  
  // Function to handle button clicks that aren't fully implemented
  const handleFeatureNotAvailable = (featureName: string) => {
    toast(`The "${featureName}" feature will be available soon!`, {
      description: "We're working hard to bring this functionality to you.",
    });
  };
  
  // Handle profile creation
  const handleCreateProfile = async () => {
    try {
      if (!profile.name || !profile.email) {
        toast.error("Please fill in your name and email");
        return;
      }
      
      // Create the new user profile
      const newUser = {
        username: profile.email.split('@')[0] + Math.floor(Math.random() * 1000),
        email: profile.email,
        name: profile.name,
        bio: profile.bio,
        experienceLevel: profile.experienceLevel as 'Newbie' | 'Casual' | 'Regular' | 'Experienced' | 'Globetrotter',
        travelStyles: profile.travelStyles,
        interests: profile.interests,
        status: 'pending' as 'pending' | 'active' | 'blocked',
        joinDate: new Date(),
        reputation: 0
      };
      
      const createdUser = await communityUsersApi.create(newUser);
      
      // Save user ID to localStorage to simulate login
      localStorage.setItem('community_user_id', createdUser.id);
      setUserId(createdUser.id);
      
      toast.success('Your profile has been created and is pending approval!');
      setIsProfileDialogOpen(false);
      
      // Prompt for subscription if not subscribed
      if (!isSubscribed) {
        setTimeout(() => {
          toast.info('Subscribe to unlock all community features', {
            action: {
              label: 'Subscribe',
              onClick: () => setIsSubscriptionModalOpen(true)
            }
          });
        }, 1500);
      }
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
      console.error(error);
    }
  };
  
  // Handle travel match creation
  const handleCreateMatch = async () => {
    try {
      if (matchPreferences.destinations.length === 0) {
        toast.error("Please add at least one destination");
        return;
      }
      
      // In a real app, we would use the actual user ID here
      const matchUserId = userId || ('mock-user-' + Math.random().toString(36).substr(2, 9));
      
      // Create the travel match preferences
      const newMatch = {
        userId: matchUserId,
        preferences: {
          destinations: matchPreferences.destinations,
          travelStyles: matchPreferences.travelStyles,
          interests: matchPreferences.interests,
          dateRange: {
            start: new Date(),
            end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
          }
        },
        status: 'active' as 'active' | 'paused' | 'closed',
        potentialMatches: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save to database
      await travelMatchesApi.create(newMatch);
      
      toast.success('Your travel match preferences have been saved!');
      toast('We\'ll notify you when we find compatible travel buddies.');
      setIsMatchDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save your preferences. Please try again.');
      console.error(error);
    }
  };
  
  // Handle successful subscription
  const handleSuccessfulSubscription = () => {
    setIsSubscribed(true);
    toast.success('Welcome to our premium community!', {
      description: 'You now have access to all community features'
    });
  };
  
  // Format date and time functions
  const formatDate = (dateString: string | Date) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const formatTime = (dateString: string | Date) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (e) {
      return '';
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
                Premium Community
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Join Our Travel Community
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Connect with fellow travelers, find travel buddies, share experiences, and participate in exclusive travel events
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    if (userId) {
                      handleProtectedAction(() => setActiveTab('members'));
                    } else {
                      setIsProfileDialogOpen(true);
                    }
                  }}
                >
                  <UserPlus className="mr-2 h-5 w-5" /> 
                  {userId ? 'Explore Community' : 'Join Community'}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => {
                    handleProtectedAction(() => setIsMatchDialogOpen(true), 'Travel Buddy Matching');
                  }}
                >
                  <Compass className="mr-2 h-5 w-5" /> Find Travel Buddy
                </Button>
              </div>
              
              {!isSubscribed && (
                <div className="mt-8">
                  <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">
                    Subscribe for unlimited access to all features
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Community Content */}
        <section className="py-16">
          <div className="container-custom">
            <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-background border border-border">
                  <TabsTrigger value="home" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Globe className="h-4 w-4 mr-2" /> Community Home
                  </TabsTrigger>
                  <TabsTrigger 
                    value="members" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    onClick={(e) => {
                      if (!isSubscribed) {
                        e.preventDefault();
                        handleProtectedAction(() => setActiveTab('members'), 'Members Directory');
                      }
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" /> Members
                  </TabsTrigger>
                  <TabsTrigger 
                    value="groups" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    onClick={(e) => {
                      if (!isSubscribed) {
                        e.preventDefault();
                        handleProtectedAction(() => setActiveTab('groups'), 'Travel Groups');
                      }
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" /> Travel Groups
                  </TabsTrigger>
                  <TabsTrigger 
                    value="events" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    onClick={(e) => {
                      if (!isSubscribed) {
                        e.preventDefault();
                        handleProtectedAction(() => setActiveTab('events'), 'Community Events');
                      }
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" /> Events
                  </TabsTrigger>
                  {isSubscribed && (
                    <TabsTrigger value="matches" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Heart className="h-4 w-4 mr-2" /> My Matches
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>
              
              {/* Home Tab */}
              <TabsContent value="home" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Featured Members */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" /> Featured Members
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isLoadingUsers ? (
                        <div className="text-center py-4">Loading members...</div>
                      ) : activeUsers.length === 0 ? (
                        <div className="text-center py-4">No members to display</div>
                      ) : (
                        activeUsers.slice(0, 5).map((user, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                            <Avatar className="h-10 w-10 border border-border">
                              <AvatarImage src={user.avatar || `https://i.pravatar.cc/150?img=${idx + 10}`} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.experienceLevel}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {user.travelStyles && user.travelStyles[0] ? user.travelStyles[0] : 'Traveler'}
                            </Badge>
                          </div>
                        ))
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        className="w-full text-primary"
                        onClick={() => handleProtectedAction(() => setActiveTab('members'), 'Members Directory')}
                      >
                        View All Members
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Upcoming Events */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" /> Upcoming Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isLoadingEvents ? (
                        <div className="text-center py-4">Loading events...</div>
                      ) : upcomingEvents.length === 0 ? (
                        <div className="text-center py-4">No upcoming events</div>
                      ) : (
                        upcomingEvents.map((event, idx) => (
                          <div 
                            key={idx} 
                            className="p-3 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={() => handleProtectedAction(() => handleFeatureNotAvailable(`View ${event.title} details`), 'Community Events')}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary">{event.type}</Badge>
                              <span className="text-xs text-muted-foreground">{formatDate(event.date)}</span>
                            </div>
                            <h4 className="font-semibold mb-1">{event.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                              {event.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs">
                                <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>{event.location.type === 'online' ? 'Online Event' : event.location.details}</span>
                              </div>
                              <span className="text-xs">{formatTime(event.date)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        className="w-full text-primary"
                        onClick={() => handleProtectedAction(() => setActiveTab('events'), 'Community Events')}
                      >
                        View All Events
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Featured Groups */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" /> Featured Groups
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isLoadingGroups ? (
                        <div className="text-center py-4">Loading groups...</div>
                      ) : featuredGroups.length === 0 ? (
                        <div className="text-center py-4">No groups to display</div>
                      ) : (
                        featuredGroups.map((group, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                            role="button"
                            onClick={() => handleProtectedAction(() => handleFeatureNotAvailable(`View ${group.name} group`), 'Travel Groups')}
                          >
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Users className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{group.name}</p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Users className="h-3 w-3 mr-1" /> 
                                {group.memberCount} members
                              </div>
                            </div>
                            <Badge>{group.category}</Badge>
                          </div>
                        ))
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        className="w-full text-primary"
                        onClick={() => handleProtectedAction(() => setActiveTab('groups'), 'Travel Groups')}
                      >
                        View All Groups
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                {/* Travel Buddy Matching Featured Section */}
                <div className="mt-16">
                  <div className="rounded-xl overflow-hidden border border-border bg-card">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <Badge className="w-fit mb-4">Premium Feature</Badge>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Find Your Perfect Travel Companion</h2>
                        <p className="text-muted-foreground mb-6">
                          Our intelligent matching algorithm connects you with like-minded travelers heading to your dream destinations. 
                          Share experiences, split costs, and make memories together!
                        </p>
                        <div className="space-y-4 mb-6">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <MapPinned className="h-3 w-3" />
                            </div>
                            <div>
                              <h4 className="font-medium">Destination Matching</h4>
                              <p className="text-sm text-muted-foreground">Connect with travelers heading to the same places</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <Calendar className="h-3 w-3" />
                            </div>
                            <div>
                              <h4 className="font-medium">Travel Date Alignment</h4>
                              <p className="text-sm text-muted-foreground">Find people traveling at the same time as you</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <Heart className="h-3 w-3" />
                            </div>
                            <div>
                              <h4 className="font-medium">Interest Compatibility</h4>
                              <p className="text-sm text-muted-foreground">Match with travelers who share your interests</p>
                            </div>
                          </div>
                        </div>
                        <Button 
                          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                          onClick={() => handleProtectedAction(() => setIsMatchDialogOpen(true), 'Travel Buddy Matching')}
                        >
                          <Compass className="mr-2 h-4 w-4" /> Find a Travel Buddy
                        </Button>
                      </div>
                      <div className="relative h-64 md:h-auto">
                        <img 
                          src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=2070" 
                          alt="Travel buddies exploring together" 
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Subscription CTA */}
                {!isSubscribed && (
                  <div className="mt-12 text-center">
                    <h3 className="text-2xl font-bold mb-4">Unlock Premium Features</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                      Subscribe to access all community features including travel buddy matching, special interest groups, and exclusive events
                    </p>
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => setIsSubscriptionModalOpen(true)}
                    >
                      Subscribe Now
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {/* Matches Tab (Premium only) */}
              <TabsContent value="matches" className="mt-0">
                {isSubscribed ? (
                  <div>
                    <div className="flex flex-col items-center text-center mb-12">
                      <h2 className="text-3xl font-bold mb-4">Travel Buddy Matches</h2>
                      <p className="text-muted-foreground max-w-2xl">
                        Our intelligent algorithm finds compatible travel companions based on your preferences
                      </p>
                    </div>
                    
                    <div className="mb-12 mx-auto max-w-4xl">
                      <IntelligentMatching 
                        userPreferences={matchPreferences}
                        userId={userId || 'guest-user'}
                      />
                    </div>
                    
                    <div className="text-center">
                      <Button
                        onClick={() => setIsMatchDialogOpen(true)}
                      >
                        Update My Matching Preferences
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mb-4">
                      <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Premium Feature</h3>
                    <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                      Subscribe to unlock travel buddy matching and connect with compatible travel companions
                    </p>
                    <Button 
                      size="lg" 
                      onClick={() => setIsSubscriptionModalOpen(true)}
                    >
                      Subscribe Now
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {/* Members Tab */}
              <TabsContent value="members" className="mt-0">
                <div className="flex flex-col items-center text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Our Community Members</h2>
                  <p className="text-muted-foreground max-w-2xl">
                    Connect with like-minded travelers from around the world
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {isLoadingUsers ? (
                    <div className="col-span-full text-center py-12">Loading members...</div>
                  ) : activeUsers.length === 0 ? (
                    <div className="col-span-full text-center py-12">No community members to display</div>
                  ) : (
                    activeUsers.map((user, idx) => (
                      <Card key={user.id} className="overflow-hidden border border-border hover:border-primary/50 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center mb-4">
                            <Avatar className="h-20 w-20 border-2 border-primary/20">
                              <AvatarImage src={user.avatar || `https://i.pravatar.cc/150?img=${idx + 10}`} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="mt-4 text-lg font-semibold">{user.name}</h3>
                            <Badge className="mt-1">{user.experienceLevel}</Badge>
                            
                            {user.badges && user.badges.length > 0 && (
                              <div className="flex mt-2 gap-1">
                                {user.badges.map((badge, bidx) => (
                                  <div 
                                    key={bidx} 
                                    className="text-yellow-500"
                                    title={badge.name}
                                  >
                                    <Award className="h-4 w-4" />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {user.bio || "No bio available"}
                          </p>
                          
                          <div className="space-y-3">
                            {user.travelStyles && user.travelStyles.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Travel Style:</p>
                                <div className="flex flex-wrap gap-1">
                                  {user.travelStyles.map((style, sidx) => (
                                    <Badge key={sidx} variant="secondary" className="text-xs">
                                      {style}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {user.interests && user.interests.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Interests:</p>
                                <div className="flex flex-wrap gap-1">
                                  {user.interests.map((interest, iidx) => (
                                    <Badge key={iidx} variant="outline" className="text-xs border-primary/30 text-primary">
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        
                        <CardFooter className="bg-muted/30 px-6 py-3">
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={() => handleFeatureNotAvailable(`Connect with ${user.name}`)}
                          >
                            Connect
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
                
                {activeUsers.length > 0 && (
                  <div className="mt-8 text-center">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary/10"
                      onClick={() => setIsProfileDialogOpen(true)}
                    >
                      <UserPlus className="mr-2 h-5 w-5" /> Join Our Community
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {/* Groups Tab */}
              <TabsContent value="groups" className="mt-0">
                <div className="flex flex-col items-center text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Travel Groups</h2>
                  <p className="text-muted-foreground max-w-2xl">
                    Join special interest groups and connect with travelers who share your passion
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoadingGroups ? (
                    <div className="col-span-full text-center py-12">Loading groups...</div>
                  ) : groups.length === 0 ? (
                    <div className="col-span-full text-center py-12">No groups to display</div>
                  ) : (
                    groups.filter(group => group.status === 'active').map((group, idx) => (
                      <Card key={group.id} className="h-full flex flex-col overflow-hidden hover:border-primary/30 transition-colors">
                        <div className="relative h-40">
                          <img 
                            src={group.image || `https://source.unsplash.com/random/400x200/?${group.category.toLowerCase()}`}
                            alt={group.name}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <Badge className="mb-2">{group.category}</Badge>
                            <h3 className="text-xl font-bold text-white">{group.name}</h3>
                          </div>
                        </div>
                        
                        <CardContent className="flex-grow p-6">
                          <p className="text-sm text-muted-foreground mb-4">
                            {group.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{group.memberCount} members</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Created {formatDate(group.dateCreated)}
                            </span>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="bg-muted/30 p-4">
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={() => handleFeatureNotAvailable(`Join ${group.name} group`)}
                          >
                            Join Group
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                  
                  {/* Create Group Card */}
                  <Card className="h-full flex flex-col border-dashed hover:border-primary/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-center flex-grow p-6">
                      <div className="text-center">
                        <div className="mx-auto h-20 w-20
