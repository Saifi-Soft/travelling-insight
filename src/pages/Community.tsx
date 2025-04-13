
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { CalendarDays, Globe, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SubscriptionModal from '@/components/community/SubscriptionModal';
import HeaderAd from '@/components/ads/HeaderAd';
import FooterAd from '@/components/ads/FooterAd';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { communityPaymentApi } from '@/api/communityApiService';

const Community = () => {
  const navigate = useNavigate();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Check if user is logged in and has subscription
  useEffect(() => {
    const storedUserId = localStorage.getItem('community_user_id');
    setUserId(storedUserId);
    
    // Check if user has active subscription
    if (storedUserId) {
      checkSubscriptionStatus(storedUserId);
    }
  }, []);
  
  // Function to check if user has an active subscription
  const checkSubscriptionStatus = async (userId: string) => {
    try {
      const subscriptionData = await communityPaymentApi.getSubscription(userId);
      setIsSubscribed(subscriptionData && subscriptionData.status === 'active');
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsSubscribed(false);
    }
  };

  // Function to handle clicking on any community feature
  const handleCommunityFeatureClick = () => {
    if (!userId) {
      toast.error('Please log in to access community features');
      navigate('/login');
      return;
    }
    
    if (!isSubscribed) {
      setIsSubscriptionModalOpen(true);
    } else {
      toast.info('You already have access to all community features!');
    }
  };
  
  // Handle successful subscription
  const handleSuccessfulSubscription = () => {
    setIsSubscribed(true);
    toast.success('Subscription successful! You now have access to all community features.');
    
    // Refresh subscription status
    if (userId) {
      checkSubscriptionStatus(userId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero section with ad */}
        <div className="relative py-20 px-4 overflow-hidden bg-slate-900">
          <div className="container mx-auto max-w-6xl relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Travel Community</h1>
            <p className="text-xl mb-10 max-w-2xl text-slate-300">
              Connect with travelers from around the world, share experiences, and plan amazing journeys together!
            </p>
            <HeaderAd className="rounded-lg overflow-hidden shadow-xl" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50"></div>
        </div>

        {/* Main features */}
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 hover:border-primary/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Travel Buddies</h2>
                </div>
                <p className="text-slate-300 mb-6">
                  Find compatible travel companions who share your interests and travel style. Connect with fellow travelers heading to the same destinations.
                </p>
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={handleCommunityFeatureClick}
                >
                  Find a Travel Buddy
                </Button>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 hover:border-primary/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Travel Groups</h2>
                </div>
                <p className="text-slate-300 mb-6">
                  Join special interest groups focused on different travel styles, destinations, and activities. Share tips and plan group adventures.
                </p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={handleCommunityFeatureClick}
                >
                  Explore Travel Groups
                </Button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 hover:border-primary/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Travel Events</h2>
                </div>
                <p className="text-slate-300 mb-6">
                  Participate in virtual meetups, workshops, and in-person gatherings. Learn from experienced travelers and make connections.
                </p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={handleCommunityFeatureClick}
                >
                  Browse Upcoming Events
                </Button>
              </div>

              <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 hover:border-primary/50 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Members Directory</h2>
                </div>
                <p className="text-slate-300 mb-6">
                  Connect with our community of global travelers. Find members with similar interests or travelers who've visited your dream destinations.
                </p>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={handleCommunityFeatureClick}
                >
                  View Members
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Ad Section */}
          <div className="mt-16">
            <FooterAd className="rounded-lg overflow-hidden shadow-xl" />
          </div>
        </div>
      </main>

      {/* Subscription Modal */}
      <SubscriptionModal
        open={isSubscriptionModalOpen}
        onOpenChange={setIsSubscriptionModalOpen}
        onSubscribe={handleSuccessfulSubscription}
      />
      
      <Footer />
    </div>
  );
};

export default Community;
