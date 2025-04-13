
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityPosts from '@/components/community/CommunityPosts';
import UserProfile from '@/components/community/UserProfile';
import CommunityEvents from '@/components/community/CommunityEvents';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Bookmark, Users, Calendar, Compass, Settings } from 'lucide-react';

const queryClient = new QueryClient();

const CommunityHub = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow py-8 px-4 md:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-2">Travel Community Hub</h1>
            <p className="text-gray-500 mb-8">Connect with fellow travelers and share your experiences</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sidebar with user profile */}
              <div className="md:col-span-1">
                <UserProfile />
              </div>
              
              {/* Main content area */}
              <div className="md:col-span-2">
                <Tabs defaultValue="feed" className="w-full">
                  <TabsList className="grid grid-cols-5 mb-8">
                    <TabsTrigger value="feed">Feed</TabsTrigger>
                    <TabsTrigger value="groups">
                      <Users className="h-4 w-4 mr-2 hidden sm:inline" />
                      <span>Groups</span>
                    </TabsTrigger>
                    <TabsTrigger value="events">
                      <Calendar className="h-4 w-4 mr-2 hidden sm:inline" />
                      <span>Events</span>
                    </TabsTrigger>
                    <TabsTrigger value="discover">
                      <Compass className="h-4 w-4 mr-2 hidden sm:inline" />
                      <span>Discover</span>
                    </TabsTrigger>
                    <TabsTrigger value="saved">
                      <Bookmark className="h-4 w-4 mr-2 hidden sm:inline" />
                      <span>Saved</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="feed">
                    <CommunityPosts />
                  </TabsContent>
                  
                  <TabsContent value="groups">
                    <div className="bg-white rounded-lg p-8 text-center">
                      <h2 className="text-2xl font-bold mb-2">Travel Groups</h2>
                      <p className="text-gray-500">Join groups based on your travel interests</p>
                      <div className="mt-6 p-12 border rounded-lg">
                        <Users className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-4 text-gray-500">Group content coming soon!</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="events">
                    <CommunityEvents />
                  </TabsContent>
                  
                  <TabsContent value="discover">
                    <div className="bg-white rounded-lg p-8 text-center">
                      <h2 className="text-2xl font-bold mb-2">Discover Travelers</h2>
                      <p className="text-gray-500">Find travelers with similar interests</p>
                      <div className="mt-6 p-12 border rounded-lg">
                        <Compass className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-4 text-gray-500">Discovery features coming soon!</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="saved">
                    <div className="bg-white rounded-lg p-8 text-center">
                      <h2 className="text-2xl font-bold mb-2">Saved Items</h2>
                      <p className="text-gray-500">View your saved posts, events, and destinations</p>
                      <div className="mt-6 p-12 border rounded-lg">
                        <Bookmark className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-4 text-gray-500">No saved items yet</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </QueryClientProvider>
  );
};

export default CommunityHub;
