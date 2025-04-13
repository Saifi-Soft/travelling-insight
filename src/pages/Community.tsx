
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
import { communityApi } from '@/api/communityApiService';

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
      const subscriptionData = await communityApi.payments.getSubscription(userId);
      setIsSubscribed(subscriptionData && subscriptionData.status === 'active');
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsSubscribed(false);
    }
  };

  // Function to handle clicking on any community feature
  const handleCommunityFeatureClick = (e: React.MouseEvent) => {
    // Prevent the default button action and event propagation
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Button clicked, checking user status...');
    
    if (!userId) {
      console.log('No user ID found, redirecting to login');
      toast.error('Please log in to access community features');
      navigate('/login');
      return;
    }
    
    if (!isSubscribed) {
      console.log('User not subscribed, showing subscription modal');
      setIsSubscriptionModalOpen(true);
    } else {
      console.log('User already subscribed');
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Community Hero Section */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6 text-gray-800">Join Our Travel Community</h1>
              <p className="text-xl mb-8 text-gray-600">
                Connect with fellow travelers, share experiences, and plan your next adventure together!
              </p>
              <HeaderAd className="mt-8" />
            </div>
          </div>
        </div>

        {/* Community Features Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Travel Buddies */}
                <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">Travel Buddies</h2>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Find compatible travel companions who share your interests and travel style. Connect with like-minded travelers and create unforgettable experiences together.
                  </p>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={handleCommunityFeatureClick}
                    type="button"
                  >
                    Find a Travel Buddy
                  </Button>
                </div>

                {/* Travel Groups */}
                <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <Globe className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">Travel Groups</h2>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Join special interest groups focused on different travel styles, destinations, and activities. Share tips and plan group adventures with fellow travelers.
                  </p>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleCommunityFeatureClick}
                    type="button"
                  >
                    Explore Travel Groups
                  </Button>
                </div>

                {/* Travel Events */}
                <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                      <CalendarDays className="h-6 w-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">Travel Events</h2>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Participate in virtual meetups, workshops, and in-person gatherings. Learn from experienced travelers and make connections while planning your next journey.
                  </p>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={handleCommunityFeatureClick}
                    type="button"
                  >
                    Browse Upcoming Events
                  </Button>
                </div>

                {/* Members Directory */}
                <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                      <MapPin className="h-6 w-6 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">Members Directory</h2>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Connect with our community of global travelers. Find members with similar interests or travelers who've visited your dream destinations.
                  </p>
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    onClick={handleCommunityFeatureClick}
                    type="button"
                  >
                    View Members
                  </Button>
                </div>
              </div>

              {/* Footer Ad */}
              <div className="mt-16">
                <FooterAd className="mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Community Testimonials - Optional section from original design */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Community Says</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12 border border-gray-200">
                        <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Member avatar" />
                      </Avatar>
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-800">
                          {["Sarah Johnson", "Michael Chen", "Emma Wilson"][i-1]}
                        </h4>
                        <p className="text-sm text-gray-500">Community Member</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">
                      {[
                        "I found my perfect travel buddy through this platform! We had such an amazing trip to Portugal and are now planning our next adventure together.",
                        "The travel groups have been an incredible resource. I joined the 'Solo Travelers' group and got so many tips that made my first solo trip a success.",
                        "The virtual meetups hosted by experienced travelers helped me plan my dream trip to Japan. I'm so grateful for this community!"
                      ][i-1]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
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
