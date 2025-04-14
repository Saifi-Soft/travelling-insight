
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { CheckCircle, Edit2, MapPin, Globe, Calendar, Users, BriefcaseBusiness, Award, Heart } from 'lucide-react';
import { communityApi } from '@/api/communityApiService';
import { CommunityUser } from '@/types/common';

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CommunityUser>>({});
  const queryClient = useQueryClient();
  
  // Fetch user data
  const { data: userData, isLoading, isError } = useQuery({
    queryKey: ['communityUser', userId],
    queryFn: () => communityApi.users.getById(userId),
    enabled: !!userId,
    meta: {
      onSuccess: (data) => {
        setFormData(data || {});
      }
    }
  });

  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  const updateUserMutation = useMutation({
    mutationFn: (updatedUser: Partial<CommunityUser>) => 
      communityApi.users.update(userId, updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityUser', userId] });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading profile...</p>
      </div>
    );
  }

  if (isError || !userData) {
    return (
      <div className="p-8 text-center">
        <div className="text-destructive text-6xl mb-4">😕</div>
        <h3 className="text-xl font-bold mb-2">User Not Found</h3>
        <p className="text-muted-foreground">
          This user profile could not be loaded. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 rounded-t-xl"></div>
        
        {/* Profile Info Card */}
        <div className="relative px-4 sm:px-6 pb-4">
          <div className="absolute -top-12 left-4 sm:left-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              {userData.avatar ? (
                <AvatarImage src={userData.avatar} alt={userData.name} />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          
          <div className="pt-14">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-bold text-2xl">{userData.name}</h1>
                <p className="text-muted-foreground">@{userData.username}</p>
                {userData.location && (
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {userData.location}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end">
                <div className="flex items-center mb-2">
                  <Badge variant="outline" className="mr-2">
                    {userData.experienceLevel}
                  </Badge>
                  <Badge variant="secondary">
                    {userData.connections?.length || 0} connections
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </div>
            
            <div className="mt-4">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <Input 
                        name="name" 
                        value={formData.name || ''} 
                        onChange={handleChange}
                        className="bg-secondary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Location</label>
                      <Input 
                        name="location" 
                        value={formData.location || ''} 
                        onChange={handleChange}
                        className="bg-secondary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Experience Level</label>
                      <Input 
                        name="experienceLevel" 
                        value={formData.experienceLevel || ''} 
                        onChange={handleChange}
                        className="bg-secondary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Website</label>
                      <Input 
                        name="website" 
                        value={formData.website || ''} 
                        onChange={handleChange}
                        className="bg-secondary/50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <Textarea 
                      name="bio" 
                      value={formData.bio || ''} 
                      onChange={handleChange}
                      rows={4}
                      className="bg-secondary/50"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={updateUserMutation.isPending}>
                      {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="text-sm">{userData.bio || 'No bio provided yet.'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="about" className="mt-4">
        <TabsList className="mb-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-semibold">Travel Styles</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userData.travelStyles && userData.travelStyles.length > 0 ? (
                    userData.travelStyles.map((style, index) => (
                      <Badge key={index} variant="secondary">
                        {style}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No travel styles added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-semibold">Interests</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userData.interests && userData.interests.length > 0 ? (
                    userData.interests.map((interest, index) => (
                      <Badge key={index} variant="outline">
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No interests added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-semibold">Countries Visited</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userData.visitedCountries && userData.visitedCountries.length > 0 ? (
                    userData.visitedCountries.map((country, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{country.name}</span>
                        </div>
                        <Badge variant="outline">{country.year}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No countries added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-semibold">Wishlist Destinations</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userData.wishlistDestinations && userData.wishlistDestinations.length > 0 ? (
                    userData.wishlistDestinations.map((destination, index) => (
                      <Badge key={index} variant="outline" className="bg-secondary/50">
                        <Heart className="h-3 w-3 mr-1 text-destructive" />
                        {destination}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No wishlist destinations added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trips">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="bg-secondary/50 p-4 rounded-full inline-block mb-4">
                  <Calendar className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Trips Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start adding your travel experiences and upcoming trips
                </p>
                <Button onClick={() => toast.info('Trip planning feature coming soon!')}>
                  Create a Trip
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="photos">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="bg-secondary/50 p-4 rounded-full inline-block mb-4">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Photos Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share photos from your adventures and travels
                </p>
                <Button onClick={() => toast.info('Photo upload feature coming soon!')}>
                  Upload Photos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="badges">
          <Card>
            <CardContent className="pt-6">
              {userData.badges && userData.badges.length > 0 ? (
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {userData.badges.map((badge, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-4 bg-secondary/30 rounded-lg">
                      <div className="w-16 h-16 bg-primary/10 rounded-full mb-3 flex items-center justify-center">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-1">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      {badge.dateEarned && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Earned {new Date(badge.dateEarned).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-secondary/50 p-4 rounded-full inline-block mb-4">
                    <Award className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Badges Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete activities and connect with other travelers to earn badges
                  </p>
                  <Button onClick={() => toast.info('Badge system coming soon!')}>
                    Explore Achievements
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
