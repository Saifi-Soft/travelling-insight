
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  User, 
  Compass, 
  MessageCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { communityApi } from '@/api/communityApiService';
import { mongoApiService } from '@/api/mongoApiService';
import CommunityPosts from '@/components/community/CommunityPosts';
import DiscoverContent from '@/components/community/DiscoverContent';

const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const userId = localStorage.getItem('community_user_id');
  const userName = localStorage.getItem('userName') || 'User';

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['communityUser', userId],
    queryFn: () => userId ? communityApi.users.getById(userId) : null,
    enabled: !!userId,
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
        "Your profile is incomplete. Complete your profile to connect with fellow travelers!", 
        { duration: 5000, icon: <User className="text-purple-500" /> }
      );
    }
  }, [isLoadingUser, isProfileIncomplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar Navigation */}
          <div className="md:col-span-3 lg:col-span-2 hidden md:block">
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-4 space-y-4 sticky top-8">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="w-12 h-12 border-2 border-purple-500">
                  {userData?.avatar ? (
                    <AvatarImage src={userData.avatar} alt={userName} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600">
                      {userName.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{userName}</h3>
                  <p className="text-sm text-slate-400">
                    {isProfileIncomplete ? 'Profile Incomplete' : 'Traveler'}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { name: 'Feed', icon: Home, tab: 'feed' },
                  { name: 'Discover', icon: Compass, tab: 'discover' },
                  { name: 'Messages', icon: MessageCircle, tab: 'messages' },
                  { name: 'Profile', icon: User, tab: 'profile' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === item.tab 
                        ? 'bg-purple-500/20 text-purple-300' 
                        : 'hover:bg-slate-700/50 text-slate-300'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>

              <Button 
                variant="default" 
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <PlusSquare className="mr-2" /> Create Post
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-9 lg:col-span-10">
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6">
              {activeTab === 'feed' && <CommunityPosts />}
              {activeTab === 'discover' && <DiscoverContent />}
              {activeTab === 'messages' && <div>Messages Coming Soon</div>}
              {activeTab === 'profile' && <div>Profile Coming Soon</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-slate-900/80 backdrop-blur-lg border-t border-slate-700 py-3 z-50">
        <div className="flex justify-around">
          {[
            { icon: Home, tab: 'feed' },
            { icon: Compass, tab: 'discover' },
            { icon: PlusSquare, tab: 'create', special: true },
            { icon: Heart, tab: 'activity' },
            { icon: User, tab: 'profile' },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => item.special 
                ? toast.info('Create post feature coming soon!') 
                : setActiveTab(item.tab)
              }
              className={`rounded-full p-2 transition-colors ${
                item.special 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : activeTab === item.tab 
                    ? 'text-purple-400' 
                    : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <item.icon size={24} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
