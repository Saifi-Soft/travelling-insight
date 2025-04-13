
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, MapPin, Calendar, Users, Bookmark, Settings, PlusCircle, Edit, Image as ImageIcon, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { communityApi } from '@/api/communityApiService';
import { communityPostsApi } from '@/api/communityPostsService';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    travelStyles: [] as string[],
    visitedCountries: [] as string[]
  });
  
  const queryClient = useQueryClient();
  const currentUserId = localStorage.getItem('community_user_id') || '';
  const isOwnProfile = currentUserId === userId;
  
  // Fetch user profile data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['communityUser', userId],
    queryFn: () => communityApi.users.getById(userId),
    onSuccess: (data) => {
      if (data) {
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          travelStyles: data.travelStyles || [],
          visitedCountries: data.visitedCountries || []
        });
      }
    }
  });
  
  // Fetch user posts
  const { data: userPosts = [], isLoading: isLoadingPosts } = useQuery({
    queryKey: ['userPosts', userId],
    queryFn: async () => {
      const allPosts = await communityPostsApi.getAllPosts();
      return allPosts.filter(post => post.userId === userId);
    },
    enabled: !!userId
  });
  
  // Fetch saved posts
  const { data: savedPosts = [], isLoading: isLoadingSaved } = useQuery({
    queryKey: ['savedPosts', userId],
    queryFn: () => isOwnProfile ? communityPostsApi.getSavedPosts(userId) : [],
    enabled: isOwnProfile && !!userId && activeTab === 'saved'
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: any) => communityApi.users.update(userId, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityUser', userId] });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddTravelStyle = (style: string) => {
    if (formData.travelStyles.includes(style)) {
      setFormData(prev => ({
        ...prev,
        travelStyles: prev.travelStyles.filter(s => s !== style)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        travelStyles: [...prev.travelStyles, style]
      }));
    }
  };
  
  const handleAddCountry = (country: string) => {
    if (!formData.visitedCountries.includes(country)) {
      setFormData(prev => ({
        ...prev,
        visitedCountries: [...prev.visitedCountries, country]
      }));
    }
  };
  
  const handleRemoveCountry = (country: string) => {
    setFormData(prev => ({
      ...prev,
      visitedCountries: prev.visitedCountries.filter(c => c !== country)
    }));
  };
  
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-24 w-24 rounded-full bg-secondary animate-pulse"></div>
            <div className="ml-4 space-y-2">
              <div className="h-6 w-32 bg-secondary rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-secondary rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-9 w-24 bg-secondary rounded animate-pulse"></div>
        </div>
        <div className="h-20 w-full bg-secondary rounded animate-pulse"></div>
        <div className="h-40 w-full bg-secondary rounded animate-pulse"></div>
      </div>
    );
  }
  
  return (
    <div className="profile">
      {!isEditing ? (
        <div className="p-4">
          {/* Profile Header */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div className="flex items-center">
              <Avatar className="h-24 w-24 border-4 border-background">
                {userData?.avatar ? (
                  <AvatarImage src={userData.avatar} alt={userData?.name} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {userData?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="ml-4">
                <h1 className="text-2xl font-bold">{userData?.name || 'User'}</h1>
                {userData?.location && (
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {userData.location}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-sm">
                    <span className="font-semibold">{userData?.connections?.length || 0}</span>
                    <span className="text-muted-foreground ml-1">connections</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">{userData?.visitedCountries?.length || 0}</span>
                    <span className="text-muted-foreground ml-1">countries</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">{userPosts.length}</span>
                    <span className="text-muted-foreground ml-1">posts</span>
                  </div>
                </div>
              </div>
            </div>
            
            {isOwnProfile ? (
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <Button 
                className="flex items-center"
                onClick={() => toast.success('Connection request sent!')}
              >
                <Users className="h-4 w-4 mr-2" />
                Connect
              </Button>
            )}
          </div>
          
          {/* Bio */}
          {userData?.bio ? (
            <p className="mb-4">{userData.bio}</p>
          ) : isOwnProfile ? (
            <Button 
              variant="ghost" 
              className="text-muted-foreground mb-4"
              onClick={() => setIsEditing(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add bio
            </Button>
          ) : null}
          
          {/* Travel Interests */}
          {userData?.travelStyles && userData.travelStyles.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Travel Style</h3>
              <div className="flex flex-wrap gap-2">
                {userData.travelStyles.map((style) => (
                  <Badge key={style} variant="secondary">{style}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Countries Visited */}
          {userData?.visitedCountries && userData.visitedCountries.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Countries Visited
              </h3>
              <ScrollArea className="whitespace-nowrap h-10">
                <div className="flex gap-2">
                  {userData.visitedCountries.map((country) => (
                    <Badge key={country} variant="outline">{country}</Badge>
                  ))}
                  {isOwnProfile && (
                    <Badge 
                      variant="outline" 
                      className="bg-transparent border border-dashed border-muted-foreground text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => setIsEditing(true)}
                    >
                      <PlusCircle className="h-3 w-3 mr-1" />
                      Add
                    </Badge>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
          
          <Separator className="my-4" />
          
          {/* Tabs for Posts, Saved, Trips */}
          <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              {isOwnProfile && <TabsTrigger value="saved">Saved</TabsTrigger>}
              <TabsTrigger value="trips">Trips</TabsTrigger>
            </TabsList>
            
            {/* Posts Tab */}
            <TabsContent value="posts">
              {isLoadingPosts ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Card key={i} className="mb-4">
                      <CardHeader className="p-4">
                        <div className="h-4 w-32 bg-secondary rounded animate-pulse"></div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="h-20 w-full bg-secondary rounded animate-pulse mb-3"></div>
                        <div className="h-48 w-full bg-secondary rounded animate-pulse"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : userPosts.length > 0 ? (
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <Card key={post._id} className="mb-4">
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center">
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </p>
                          {post.location && (
                            <p className="text-xs text-muted-foreground flex items-center ml-2">
                              <MapPin className="h-3 w-3 mr-1" />
                              {post.location}
                            </p>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="py-0 px-4">
                        <p className="whitespace-pre-line mb-3">{post.content}</p>
                        {post.images && post.images.length > 0 && (
                          <div className={`grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {post.images.map((image, idx) => (
                              <img 
                                key={idx} 
                                src={image} 
                                alt="Post" 
                                className="rounded-md object-cover w-full h-64"
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex justify-between text-xs text-muted-foreground mt-3">
                          <span>{post.likes || 0} likes</span>
                          <span>{post.comments || 0} comments</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <h3 className="text-lg font-semibold mb-1">No Posts Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isOwnProfile 
                      ? "Share your travel experiences and memories"
                      : "This user hasn't shared any posts yet"}
                  </p>
                  {isOwnProfile && (
                    <Button onClick={() => toast.info('Create post feature coming soon!')}>
                      Create Post
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Saved Posts Tab (Only visible to profile owner) */}
            {isOwnProfile && (
              <TabsContent value="saved">
                {isLoadingSaved ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Card key={i} className="mb-4">
                        <CardHeader className="p-4">
                          <div className="h-4 w-32 bg-secondary rounded animate-pulse"></div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                          <div className="h-20 w-full bg-secondary rounded animate-pulse mb-3"></div>
                          <div className="h-48 w-full bg-secondary rounded animate-pulse"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : savedPosts.length > 0 ? (
                  <div className="space-y-4">
                    {savedPosts.map((post) => (
                      <Card key={post._id} className="mb-4">
                        <CardHeader className="py-3 px-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                {post.userAvatar ? (
                                  <AvatarImage src={post.userAvatar} alt={post.userName} />
                                ) : (
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {post.userName.charAt(0)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{post.userName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toast.info('Unsave feature coming soon!')}
                            >
                              <Bookmark className="h-4 w-4 fill-primary text-primary" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="py-0 px-4">
                          <p className="whitespace-pre-line mb-3">{post.content}</p>
                          {post.images && post.images.length > 0 && (
                            <div className={`grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                              {post.images.map((image, idx) => (
                                <img 
                                  key={idx} 
                                  src={image} 
                                  alt="Post" 
                                  className="rounded-md object-cover w-full h-64"
                                />
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <h3 className="text-lg font-semibold mb-1">No Saved Posts</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Save posts to view them later
                    </p>
                  </div>
                )}
              </TabsContent>
            )}
            
            {/* Trips Tab */}
            <TabsContent value="trips">
              <div className="text-center p-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-semibold mb-1">Trip Plans</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isOwnProfile 
                    ? "Your upcoming and past trip plans will appear here"
                    : "This user hasn't shared any trip plans yet"}
                </p>
                {isOwnProfile && (
                  <Button onClick={() => toast.info('Trip planning feature coming soon!')}>
                    Plan a Trip
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        /* Edit Profile Form */
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Edit Profile</h2>
            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 border-4 border-background mb-3">
                {userData?.avatar ? (
                  <AvatarImage src={userData.avatar} alt={userData?.name} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {userData?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
                onClick={() => toast.info('Profile picture upload coming soon!')}
                type="button"
              >
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>
            
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input 
                id="name" 
                name="name"
                value={formData.name} 
                onChange={handleInputChange}
                className="bg-secondary/50"
                required
              />
            </div>
            
            {/* Bio */}
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">Bio</label>
              <Textarea 
                id="bio" 
                name="bio"
                value={formData.bio} 
                onChange={handleInputChange}
                className="bg-secondary/50 min-h-[100px]"
                placeholder="Tell us about yourself and your travel interests..."
              />
            </div>
            
            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Location</label>
              <Input 
                id="location" 
                name="location"
                value={formData.location} 
                onChange={handleInputChange}
                className="bg-secondary/50"
                placeholder="City, Country"
              />
            </div>
            
            {/* Website */}
            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium">Website</label>
              <Input 
                id="website" 
                name="website"
                value={formData.website} 
                onChange={handleInputChange}
                className="bg-secondary/50"
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            {/* Travel Styles */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Travel Style</label>
              <div className="flex flex-wrap gap-2">
                {['Adventure', 'Beach', 'Cultural', 'Eco-friendly', 'Food & Wine', 
                  'Luxury', 'Budget', 'Backpacking', 'Solo', 'Family'].map((style) => (
                  <Badge
                    key={style}
                    variant={formData.travelStyles.includes(style) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleAddTravelStyle(style)}
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Countries Visited */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Countries Visited</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.visitedCountries.map((country) => (
                  <Badge key={country} variant="secondary" className="flex items-center gap-1">
                    {country}
                    <button 
                      type="button" 
                      className="ml-1 hover:text-destructive" 
                      onClick={() => handleRemoveCountry(country)}
                    >
                      &times;
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  id="newCountry"
                  placeholder="Add country..."
                  className="bg-secondary/50"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    const input = document.getElementById('newCountry') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleAddCountry(input.value.trim());
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
