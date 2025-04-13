
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Globe, MapPin, Users, Search, UserPlus, Bookmark, TrendingUp } from 'lucide-react';
import { mongoApiService } from '@/api/mongoApiService';

interface TrendingLocation {
  _id?: string;
  name: string;
  country: string;
  image: string;
  popularity: number;
  activities: string[];
}

interface TravelGroup {
  _id?: string;
  name: string;
  description: string;
  image?: string;
  members: number;
  destination?: string;
  interests: string[];
}

interface TravelerProfile {
  _id?: string;
  userId: string;
  name: string;
  avatar?: string;
  bio: string;
  location: string;
  visitedCountries: string[];
  plannedTrips?: {
    destination: string;
    startDate: string;
    endDate: string;
  }[];
  travelStyles: string[];
}

const DiscoverContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('travelers');
  const userId = localStorage.getItem('community_user_id');

  // Fetch trending locations
  const { data: locations = [], isLoading: isLocationsLoading } = useQuery({
    queryKey: ['trendingLocations'],
    queryFn: () => mongoApiService.queryDocuments('trendingLocations', {}),
  });

  // Fetch travel groups
  const { data: groups = [], isLoading: isGroupsLoading } = useQuery({
    queryKey: ['travelGroups'],
    queryFn: () => mongoApiService.queryDocuments('travelGroups', {}),
  });

  // Fetch travelers
  const { data: travelers = [], isLoading: isTravelersLoading } = useQuery({
    queryKey: ['travelers'],
    queryFn: () => mongoApiService.queryDocuments('communityUsers', {}),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for: ${searchQuery}`);
    // Implement actual search
  };

  const handleConnect = (travelerId: string) => {
    toast.success('Connection request sent!');
    // Implement actual connection logic
  };

  const handleJoinGroup = (groupId: string) => {
    toast.success('Request to join group sent!');
    // Implement actual join group logic
  };

  const handleSaveLocation = (locationId: string) => {
    toast.success('Location saved to your wishlist!');
    // Implement actual save location logic
  };

  return (
    <div className="discover-content">
      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder={`Search ${activeTab}...`}
            className="pl-10 w-full bg-secondary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Tabs for different discover sections */}
      <div className="p-4 pb-0">
        <Tabs defaultValue="travelers" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="travelers" className="text-xs sm:text-sm">
              <Users className="h-4 w-4 mr-2 hidden sm:inline" />
              Travelers
            </TabsTrigger>
            <TabsTrigger value="locations" className="text-xs sm:text-sm">
              <Globe className="h-4 w-4 mr-2 hidden sm:inline" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs sm:text-sm">
              <Users className="h-4 w-4 mr-2 hidden sm:inline" />
              Groups
            </TabsTrigger>
          </TabsList>
          
          {/* Travelers Tab */}
          <TabsContent value="travelers" className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isTravelersLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <Card key={i} className="border border-border overflow-hidden">
                    <div className="bg-secondary h-20"></div>
                    <CardContent className="pt-0">
                      <div className="-mt-10 flex flex-col items-center">
                        <Skeleton className="h-20 w-20 rounded-full mb-3" />
                        <Skeleton className="h-5 w-28 mb-1" />
                        <Skeleton className="h-4 w-20 mb-3" />
                        <Skeleton className="h-16 w-full mb-3" />
                        <div className="flex gap-2 mb-3">
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-9 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                travelers.map((traveler: TravelerProfile) => (
                  <Card key={traveler._id} className="border border-border overflow-hidden bg-card/50">
                    <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 h-20"></div>
                    <CardContent className="pt-0">
                      <div className="-mt-10 flex flex-col items-center">
                        <Avatar className="h-20 w-20 border-4 border-background mb-3">
                          {traveler.avatar ? (
                            <AvatarImage src={traveler.avatar} alt={traveler.name} />
                          ) : (
                            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                              {traveler.name.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <h3 className="font-semibold">{traveler.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {traveler.location}
                        </p>
                        <p className="text-sm text-center mb-3 line-clamp-2">{traveler.bio}</p>
                        <div className="flex flex-wrap gap-2 mb-4 justify-center">
                          {traveler.travelStyles?.slice(0, 2).map((style, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {style}
                            </Badge>
                          ))}
                          {(traveler.travelStyles?.length || 0) > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{traveler.travelStyles!.length - 2}
                            </Badge>
                          )}
                        </div>
                        <Button 
                          className="w-full" 
                          variant={traveler.userId === userId ? "secondary" : "default"}
                          onClick={() => handleConnect(traveler.userId)}
                          disabled={traveler.userId === userId}
                        >
                          {traveler.userId === userId ? (
                            "Your Profile"
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Locations Tab */}
          <TabsContent value="locations" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLocationsLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-24 mb-4" />
                      <div className="flex gap-2 mb-3">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 px-4 pb-4">
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : (
                locations.map((location: TrendingLocation) => (
                  <Card key={location._id} className="overflow-hidden bg-card/50">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={location.image} 
                        alt={location.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary/80 hover:bg-primary text-white flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{location.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{location.country}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {location.activities.slice(0, 3).map((activity, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                        {location.activities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{location.activities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 px-4 pb-4">
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleSaveLocation(location._id || '')}
                      >
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save to Wishlist
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Groups Tab */}
          <TabsContent value="groups" className="pt-4">
            <div className="grid grid-cols-1 gap-4">
              {isGroupsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <Skeleton className="h-32 sm:h-full sm:w-1/3 w-full" />
                      <div className="p-4 flex-1">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-16 w-full mb-3" />
                        <div className="flex gap-2 mb-3">
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-9 w-full sm:w-40" />
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                groups.map((group: TravelGroup) => (
                  <Card key={group._id} className="overflow-hidden bg-card/50">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3 w-full h-32 sm:h-auto relative">
                        <img 
                          src={group.image || 'https://placehold.co/600x400?text=Group'} 
                          alt={group.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2">
                          <Badge className="bg-secondary/80 text-foreground">
                            <Users className="h-3 w-3 mr-1" />
                            {group.members} members
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 flex-1">
                        <h3 className="font-semibold">{group.name}</h3>
                        {group.destination && (
                          <p className="text-sm text-muted-foreground mb-2 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {group.destination}
                          </p>
                        )}
                        <p className="text-sm mb-3 line-clamp-2">{group.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {group.interests?.slice(0, 2).map((interest, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {(group.interests?.length || 0) > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{group.interests!.length - 2}
                            </Badge>
                          )}
                        </div>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleJoinGroup(group._id || '')}
                        >
                          Request to Join
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DiscoverContent;
