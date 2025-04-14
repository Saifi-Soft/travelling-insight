
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  Users, 
  MessageCircle, 
  Bell, 
  User, 
  Compass, 
  TrendingUp,
  Globe,
  MapPin,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { communityApi } from '@/api/communityApiService';
import { mongoApiService } from '@/api/mongoApiService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import FeedContent from '@/components/community/FeedContent';
import DiscoverContent from '@/components/community/DiscoverContent';
import CreatePost from '@/components/community/CreatePost';
import MessagesContent from '@/components/community/MessagesContent';
import TravelBuddyFinder from '@/components/community/TravelBuddyFinder';
import UserProfile from '@/components/community/UserProfile';
import NotificationsPanel from '@/components/community/NotificationsPanel';
import { extendCommunityApiWithNotifications } from '@/api/notificationsService';
import { extendCommunityApi } from '@/api/communityApiExtension';

// Extend the API to include notifications
// In a real app, you would do this at application bootstrap
if (typeof window !== 'undefined') {
  // Extend the API with notifications
  const existingApi = (window as any).communityApi || communityApi;
  (window as any).communityApi = extendCommunityApi(existingApi);
}

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const userId = localStorage.getItem('community_user_id');
  const userName = localStorage.getItem('userName') || 'User';

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['communityUser', userId],
    queryFn: () => userId ? communityApi.users.getById(userId) : null,
    enabled: !!userId,
  });

  const { data: notificationCount = 0 } = useQuery({
    queryKey: ['notificationCount', userId],
    queryFn: () => {
      if (!userId || !window.communityApi?.notifications) return 0;
      return window.communityApi.notifications.getUnreadCount(userId);
    },
    enabled: !!userId && !!(window as any).communityApi?.notifications,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const isProfileIncomplete = !userData || 
    !userData.bio || 
    !userData.travelStyles || 
    userData.travelStyles.length === 0 || 
    !userData.visitedCountries || 
    userData.visitedCountries.length === 0;

  useEffect(() => {
    if (!isLoadingUser && isProfileIncomplete) {
      toast.info(
        "Complete your profile to connect with fellow travelers!", 
        { duration: 5000, icon: <User className="text-primary" /> }
      );
    }
  }, [isLoadingUser, isProfileIncomplete]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for: ${searchQuery}`);
    // Implement actual search functionality
  };

  // Ensure users see warnings by opening notifications panel when there's a new warning
  useEffect(() => {
    if (notificationCount > 0) {
      // Check if there's a content warning
      const checkForWarnings = async () => {
        if (userId && (window as any).communityApi?.notifications) {
          const notifications = await (window as any).communityApi.notifications.getAll(userId);
          const hasContentWarning = notifications.some(n => 
            !n.read && (n.type === 'content_warning' || n.type === 'account_blocked')
          );
          
          if (hasContentWarning) {
            setShowNotifications(true);
          }
        }
      };
      
      checkForWarnings();
    }
  }, [notificationCount, userId]);

  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* Top Navigation Bar (Mobile & Desktop) */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
            Travel Community
          </h1>
          
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search travelers, destinations, posts..."
                className="pl-10 w-full bg-secondary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hidden md:flex"
              onClick={() => setShowNotifications(prev => !prev)}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>
            
            <Avatar className="h-9 w-9 border-2 border-green-700">
              {userData?.avatar ? (
                <AvatarImage src={userData.avatar} alt={userName} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-green-700 to-green-500">
                  {userName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
        
        {/* Notifications Panel */}
        {showNotifications && (
          <div className="absolute right-4 top-16 z-50 mt-2">
            <NotificationsPanel 
              userId={userId || ''} 
              onClose={() => setShowNotifications(false)}
            />
          </div>
        )}
      </header>
      
      <div className="container mx-auto pt-20 pb-20 px-2 md:px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Left Sidebar (Desktop only) */}
          <div className="hidden md:block md:col-span-3 lg:col-span-2">
            <div className="sticky top-20 space-y-6">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border">
                {/* Profile Summary */}
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="h-16 w-16 border-2 border-green-700 mb-2">
                    {userData?.avatar ? (
                      <AvatarImage src={userData.avatar} alt={userName} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-green-700 to-green-500">
                        {userName.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <h3 className="font-semibold">{userName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {userData?.location || 'Add your location'}
                  </p>
                  
                  {isProfileIncomplete && (
                    <div className="mt-2 w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-green-700 h-2 rounded-full" 
                        style={{ width: userData ? '40%' : '10%' }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Main Navigation */}
                <nav className="space-y-1">
                  {[
                    { name: 'Feed', icon: Home, tab: 'feed' },
                    { name: 'Discover', icon: Compass, tab: 'discover' },
                    { name: 'Travel Buddies', icon: Users, tab: 'buddies' },
                    { name: 'Messages', icon: MessageCircle, tab: 'messages' },
                    { name: 'My Profile', icon: User, tab: 'profile' },
                  ].map((item) => (
                    <Button
                      key={item.name}
                      variant={activeTab === item.tab ? 'secondary' : 'ghost'}
                      className={`w-full justify-start ${
                        activeTab === item.tab ? 'bg-secondary text-green-700 font-medium' : ''
                      }`}
                      onClick={() => setActiveTab(item.tab)}
                    >
                      <item.icon className={`mr-2 h-4 w-4 ${activeTab === item.tab ? 'text-green-700' : ''}`} />
                      {item.name}
                    </Button>
                  ))}
                  
                  <Button 
                    variant="default" 
                    className="w-full bg-green-700 hover:bg-green-800 mt-2"
                    onClick={() => setActiveTab('create')}
                  >
                    Create Post
                  </Button>
                </nav>
              </div>
              
              {/* Travel Stats */}
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border">
                <h3 className="font-medium mb-2 flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Your Travel Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Countries Visited</span>
                    <span className="font-medium">{userData?.visitedCountries?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Travel Buddies</span>
                    <span className="font-medium">{userData?.connections?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Trip Plans</span>
                    <span className="font-medium">{userData?.trips?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <main className="md:col-span-9 lg:col-span-7">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl shadow-sm border border-border overflow-hidden">
              {/* Mobile Search */}
              <div className="p-4 border-b border-border md:hidden">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-10 w-full bg-secondary/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>
              
              {/* Content Based on Active Tab */}
              <div className="p-0">
                {activeTab === 'feed' && <FeedContent />}
                {activeTab === 'discover' && <DiscoverContent />}
                {activeTab === 'buddies' && <TravelBuddyFinder />}
                {activeTab === 'messages' && <MessagesContent />}
                {activeTab === 'create' && <CreatePost />}
                {activeTab === 'profile' && <UserProfile userId={userId || ''} />}
              </div>
            </div>
          </main>
          
          {/* Right Sidebar (Desktop only) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 space-y-6">
              {/* Trending Destinations */}
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border">
                <h3 className="font-medium mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending Destinations
                </h3>
                <div className="space-y-3">
                  {['Bali, Indonesia', 'Santorini, Greece', 'Kyoto, Japan'].map((destination) => (
                    <div key={destination} className="flex items-center">
                      <MapPin className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="text-sm">{destination}</span>
                    </div>
                  ))}
                  <Button variant="link" className="text-xs p-0 h-auto text-green-700">
                    See more destinations
                  </Button>
                </div>
              </div>
              
              {/* Travel Buddies Suggestions */}
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border">
                <h3 className="font-medium mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Suggested Travel Buddies
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Emma H.', location: 'Barcelona', match: '92%' },
                    { name: 'James L.', location: 'Tokyo', match: '85%' },
                    { name: 'Sophia R.', location: 'New York', match: '78%' }
                  ].map((buddy) => (
                    <div key={buddy.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback className="bg-secondary text-xs">
                            {buddy.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{buddy.name}</p>
                          <p className="text-xs text-muted-foreground">{buddy.location}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Connect
                      </Button>
                    </div>
                  ))}
                  <Button variant="link" className="text-xs p-0 h-auto text-green-700">
                    Find more buddies
                  </Button>
                </div>
              </div>
              
              {/* Active Trips */}
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border">
                <h3 className="font-medium mb-3 flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Active Trip Requests
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="p-2 bg-secondary/50 rounded-lg">
                    <p className="font-medium">Paris in April</p>
                    <p className="text-xs text-muted-foreground mb-2">Apr 10-20 • 3 interested</p>
                    <Button size="sm" variant="outline" className="w-full text-xs h-7">
                      View Details
                    </Button>
                  </div>
                  <div className="p-2 bg-secondary/50 rounded-lg">
                    <p className="font-medium">Bangkok Food Tour</p>
                    <p className="text-xs text-muted-foreground mb-2">May 5-12 • 2 interested</p>
                    <Button size="sm" variant="outline" className="w-full text-xs h-7">
                      View Details
                    </Button>
                  </div>
                  <Button variant="link" className="text-xs p-0 h-auto text-green-700">
                    See all trip requests
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background/80 backdrop-blur-lg border-t border-border z-10">
        <div className="flex justify-between px-2">
          {[
            { icon: Home, tab: 'feed' },
            { icon: Compass, tab: 'discover' },
            { icon: Users, tab: 'buddies' },
            { icon: MessageCircle, tab: 'messages' },
            { icon: User, tab: 'profile' }
          ].map((item) => (
            <Button
              key={item.tab}
              variant="ghost"
              size="icon"
              className={`py-3 ${activeTab === item.tab ? 'text-green-700' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab(item.tab)}
            >
              <item.icon className={`h-5 w-5 ${activeTab === item.tab ? 'fill-green-700/10' : ''}`} />
            </Button>
          ))}
        </div>
        
        {/* Floating Action Button for Create Post */}
        <Button
          onClick={() => setActiveTab('create')}
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 rounded-full w-12 h-12 bg-green-700 hover:bg-green-800 shadow-lg flex items-center justify-center"
        >
          <span className="text-2xl font-light">+</span>
        </Button>
      </div>
    </div>
  );
};

export default CommunityHub;
