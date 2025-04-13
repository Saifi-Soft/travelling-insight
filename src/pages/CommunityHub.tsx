
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityPosts from '@/components/community/CommunityPosts';
import UserProfile from '@/components/community/UserProfile';
import CommunityEvents from '@/components/community/CommunityEvents';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@/components/ui/menubar';
import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  User, 
  Bookmark, 
  Settings, 
  Bell, 
  CalendarDays, 
  Users2, 
  Compass 
} from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { communityApi } from '@/api/communityApiService';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mongoApiService } from '@/api/mongoApiService';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const queryClient = new QueryClient();

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const userId = localStorage.getItem('community_user_id');
  const userName = localStorage.getItem('userName') || 'User';

  // Fetch user profile data
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['communityUser', userId],
    queryFn: () => userId ? communityApi.users.getById(userId) : null,
    enabled: !!userId,
  });

  // Check if profile is empty/incomplete
  const isProfileIncomplete = !userData || 
    !userData.bio || 
    !userData.travelStyles || 
    userData.travelStyles.length === 0 || 
    !userData.visitedCountries || 
    userData.visitedCountries.length === 0;

  useEffect(() => {
    // Show a toast notification if profile is incomplete
    if (!isLoadingUser && isProfileIncomplete) {
      toast.info(
        "Your profile is incomplete. Complete your profile to connect with like-minded travelers!", 
        { duration: 5000 }
      );
    }
  }, [isLoadingUser, isProfileIncomplete]);

  // Create demo user in MongoDB if it doesn't exist
  useEffect(() => {
    const createDemoUser = async () => {
      if (!userId) return;
      
      try {
        const existingUsers = await mongoApiService.queryDocuments('communityUsers', { id: userId });
        
        if (existingUsers.length === 0) {
          await mongoApiService.insertDocument('communityUsers', {
            id: userId,
            name: userName,
            username: userName.toLowerCase().replace(/\s+/g, ''),
            email: `${userName.toLowerCase().replace(/\s+/g, '')}@example.com`,
            joinDate: new Date().toISOString(),
            status: 'active',
            experienceLevel: 'Newbie',
            travelStyles: [],
            visitedCountries: [],
            wishlistDestinations: [],
            interests: [],
            reputation: 0
          });
          console.log('Created demo user in MongoDB');
        }
      } catch (error) {
        console.error('Error creating demo user:', error);
      }
    };
    
    createDemoUser();
  }, [userId, userName]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <Navbar />
        
        <main className="flex-grow pt-4 pb-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            {/* Mobile Navigation Bar */}
            <div className="md:hidden flex justify-between items-center py-2 mb-6">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                TravelSphere
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" size="icon" className="text-white">
                  <Bell size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-white">
                  <Search size={20} />
                </Button>
              </div>
            </div>
            
            {/* Desktop Header with Search */}
            <div className="hidden md:flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                TravelSphere Community
              </h1>
              
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search travelers, posts, destinations..." 
                    className="pl-10 pr-4 py-2 bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <Button variant="ghost" size="icon" className="bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-full">
                  <Bell size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-full">
                  <Settings size={20} />
                </Button>
                {userData?.avatar ? (
                  <Avatar className="h-10 w-10 border-2 border-purple-500">
                    <img src={userData.avatar} alt={userData.name} />
                  </Avatar>
                ) : (
                  <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-purple-500">
                    <span className="text-lg font-semibold">{userName.charAt(0)}</span>
                  </Avatar>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar */}
              <div className="hidden lg:block">
                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-5 shadow-lg sticky top-24">
                  <div className="flex flex-col items-center mb-6">
                    {isLoadingUser ? (
                      <Skeleton className="h-20 w-20 rounded-full mb-4" />
                    ) : userData?.avatar ? (
                      <Avatar className="h-20 w-20 border-2 border-purple-500">
                        <img src={userData.avatar} alt={userData.name} />
                      </Avatar>
                    ) : (
                      <Avatar className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-purple-500">
                        <span className="text-xl font-bold">{userName.charAt(0)}</span>
                      </Avatar>
                    )}
                    
                    {isLoadingUser ? (
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-6 w-32 mx-auto" />
                        <Skeleton className="h-4 w-20 mx-auto" />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold mt-2">{userData?.name || userName}</h3>
                        <p className="text-sm text-gray-400">{userData?.experienceLevel || 'Traveler'}</p>
                      </>
                    )}
                    
                    {isProfileIncomplete && (
                      <Button variant="outline" size="sm" className="mt-3 border-purple-500 text-purple-500 hover:bg-purple-500/20"
                        onClick={() => setActiveTab('profile')}>
                        Complete Profile
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-5">
                    <NavigationLink 
                      icon={<Home size={20} />} 
                      label="Feed" 
                      isActive={activeTab === 'feed'}
                      onClick={() => setActiveTab('feed')}
                    />
                    <NavigationLink 
                      icon={<Search size={20} />} 
                      label="Discover" 
                      isActive={activeTab === 'discover'}
                      onClick={() => setActiveTab('discover')}
                    />
                    <NavigationLink 
                      icon={<CalendarDays size={20} />} 
                      label="Events" 
                      isActive={activeTab === 'events'}
                      onClick={() => setActiveTab('events')}
                    />
                    <NavigationLink 
                      icon={<Users2 size={20} />} 
                      label="Groups" 
                      isActive={activeTab === 'groups'}
                      onClick={() => setActiveTab('groups')}
                    />
                    <NavigationLink 
                      icon={<Bookmark size={20} />} 
                      label="Saved" 
                      isActive={activeTab === 'saved'}
                      onClick={() => setActiveTab('saved')}
                    />
                    <NavigationLink 
                      icon={<User size={20} />} 
                      label="Profile" 
                      isActive={activeTab === 'profile'}
                      onClick={() => setActiveTab('profile')}
                    />
                    <NavigationLink 
                      icon={<Settings size={20} />} 
                      label="Settings" 
                      isActive={activeTab === 'settings'}
                      onClick={() => setActiveTab('settings')}
                    />
                  </div>
                  
                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                    <PlusSquare size={18} className="mr-2" />
                    New Post
                  </Button>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="lg:col-span-3">
                {/* Mobile Navigation Tabs */}
                <div className="lg:hidden overflow-x-auto pb-3 mb-4">
                  <div className="flex space-x-1 min-w-max">
                    <MobileNavTab 
                      icon={<Home size={18} />} 
                      isActive={activeTab === 'feed'} 
                      onClick={() => setActiveTab('feed')}
                    />
                    <MobileNavTab 
                      icon={<Search size={18} />} 
                      isActive={activeTab === 'discover'} 
                      onClick={() => setActiveTab('discover')}
                    />
                    <MobileNavTab 
                      icon={<CalendarDays size={18} />} 
                      isActive={activeTab === 'events'} 
                      onClick={() => setActiveTab('events')}
                    />
                    <MobileNavTab 
                      icon={<Users2 size={18} />} 
                      isActive={activeTab === 'groups'} 
                      onClick={() => setActiveTab('groups')}
                    />
                    <MobileNavTab 
                      icon={<Bookmark size={18} />} 
                      isActive={activeTab === 'saved'} 
                      onClick={() => setActiveTab('saved')}
                    />
                    <MobileNavTab 
                      icon={<User size={18} />} 
                      isActive={activeTab === 'profile'} 
                      onClick={() => setActiveTab('profile')}
                    />
                  </div>
                </div>
                
                {/* Content based on active tab */}
                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 shadow-xl">
                  {activeTab === 'feed' && (
                    <div>
                      <CommunityPosts />
                    </div>
                  )}
                  
                  {activeTab === 'discover' && (
                    <div className="text-center py-12">
                      <Compass className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Discover Travelers</h2>
                      <p className="text-gray-400">Find travelers with similar interests</p>
                      <div className="mt-6 p-12 border border-slate-600 rounded-lg">
                        <p className="text-gray-400">Discovery features coming soon!</p>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'events' && (
                    <div>
                      <CommunityEvents />
                    </div>
                  )}
                  
                  {activeTab === 'groups' && (
                    <div className="text-center py-12">
                      <Users2 className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Travel Groups</h2>
                      <p className="text-gray-400">Join groups based on your travel interests</p>
                      <div className="mt-6 p-12 border border-slate-600 rounded-lg">
                        <p className="text-gray-400">Group features coming soon!</p>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'saved' && (
                    <div className="text-center py-12">
                      <Bookmark className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Saved Items</h2>
                      <p className="text-gray-400">View your saved posts, events, and destinations</p>
                      <div className="mt-6 p-12 border border-slate-600 rounded-lg">
                        <p className="text-gray-400">No saved items yet</p>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'profile' && (
                    <div>
                      <UserProfile />
                    </div>
                  )}
                  
                  {activeTab === 'settings' && (
                    <div className="text-center py-12">
                      <Settings className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
                      <p className="text-gray-400">Manage your account preferences</p>
                      <div className="mt-6 p-12 border border-slate-600 rounded-lg">
                        <p className="text-gray-400">Settings features coming soon!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-700 p-2 z-50">
          <div className="flex justify-around">
            <MobileNavButton 
              icon={<Home size={24} />} 
              isActive={activeTab === 'feed'} 
              onClick={() => setActiveTab('feed')}
            />
            <MobileNavButton 
              icon={<Search size={24} />} 
              isActive={activeTab === 'discover'} 
              onClick={() => setActiveTab('discover')}
            />
            <MobileNavButton 
              icon={<PlusSquare size={24} />} 
              isSpecial 
              onClick={() => toast.info('Create post feature coming soon!')}
            />
            <MobileNavButton 
              icon={<Heart size={24} />} 
              isActive={activeTab === 'saved'} 
              onClick={() => setActiveTab('saved')}
            />
            <MobileNavButton 
              icon={<User size={24} />} 
              isActive={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')}
            />
          </div>
        </div>
        
        <Footer />
      </div>
    </QueryClientProvider>
  );
};

// Navigation Link Component for Desktop Sidebar
const NavigationLink = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white' 
          : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {isActive && (
        <div className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
      )}
    </button>
  );
};

// Mobile Navigation Tab Component
const MobileNavTab = ({ icon, isActive, onClick }) => {
  return (
    <button
      className={`p-3 flex items-center justify-center rounded-lg transition-colors ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white' 
          : 'text-gray-400 hover:bg-slate-700/50'
      }`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

// Mobile Navigation Button Component for Bottom Bar
const MobileNavButton = ({ icon, isActive, isSpecial = false, onClick }) => {
  return (
    <button
      className={`p-2 rounded-full ${
        isSpecial 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
          : isActive 
            ? 'text-blue-400' 
            : 'text-gray-400'
      }`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default CommunityHub;
