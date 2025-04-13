
import React, { useState } from 'react';
import { Search, Globe, Compass, MapPin, Users, Tag, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { mongoApiService } from '@/api/mongoApiService';
import { communityApi } from '@/api/communityApiService';
import { Skeleton } from '@/components/ui/skeleton';

interface DiscoverUser {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
  travelStyles?: string[];
  visitedCountries?: string[];
}

interface DiscoverLocation {
  _id: string;
  name: string;
  image: string;
  description: string;
  popularity: number;
}

interface DiscoverGroup {
  _id: string;
  name: string;
  image?: string;
  description: string;
  memberCount: number;
}

const DiscoverContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'travelers' | 'locations' | 'groups'>('all');

  // Fetch users
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['discoverUsers'],
    queryFn: async () => {
      try {
        return await mongoApiService.queryDocuments('communityUsers', {});
      } catch (error) {
        console.error('Error fetching users:', error);
        return [];
      }
    },
  });

  // Fetch popular locations (we'll mock this with MongoDB)
  const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
    queryKey: ['discoverLocations'],
    queryFn: async () => {
      try {
        const locations = await mongoApiService.queryDocuments('travelLocations', {});
        if (locations.length === 0) {
          // If no locations exist, create some sample data
          const sampleLocations = [
            {
              name: 'Bali, Indonesia',
              image: 'https://images.unsplash.com/photo-1573790387438-4da905039392',
              description: 'Tropical paradise with stunning beaches and vibrant culture',
              popularity: 95
            },
            {
              name: 'Santorini, Greece',
              image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e',
              description: 'Iconic white buildings and breathtaking Mediterranean views',
              popularity: 92
            },
            {
              name: 'Tokyo, Japan',
              image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
              description: 'Ultramodern cityscape blended with ancient traditions',
              popularity: 89
            }
          ];
          
          for (const location of sampleLocations) {
            await mongoApiService.insertDocument('travelLocations', location);
          }
          
          return sampleLocations;
        }
        return locations;
      } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
      }
    },
  });

  // Fetch travel groups
  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['discoverGroups'],
    queryFn: async () => {
      try {
        const groups = await mongoApiService.queryDocuments('travelGroups', {});
        if (groups.length === 0) {
          // If no groups exist, create some sample data
          const sampleGroups = [
            {
              name: 'Solo Backpackers',
              description: 'Connect with fellow solo travelers around the world',
              memberCount: 1250,
              image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60'
            },
            {
              name: 'Luxury Travel Enthusiasts',
              description: 'For those who appreciate the finer experiences in travel',
              memberCount: 854,
              image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c'
            },
            {
              name: 'Adventure Seekers',
              description: 'Adrenaline junkies and outdoor adventure lovers',
              memberCount: 2103,
              image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba'
            }
          ];
          
          for (const group of sampleGroups) {
            await mongoApiService.insertDocument('travelGroups', group);
          }
          
          return sampleGroups;
        }
        return groups;
      } catch (error) {
        console.error('Error fetching groups:', error);
        return [];
      }
    },
  });

  const filteredData = () => {
    const query = searchQuery.toLowerCase();
    
    let filteredUsers = users.filter((user: DiscoverUser) =>
      user.name?.toLowerCase().includes(query) || 
      user.bio?.toLowerCase().includes(query) ||
      user.travelStyles?.some(style => style.toLowerCase().includes(query))
    );
    
    let filteredLocations = locations.filter((location: DiscoverLocation) =>
      location.name?.toLowerCase().includes(query) || 
      location.description?.toLowerCase().includes(query)
    );
    
    let filteredGroups = groups.filter((group: DiscoverGroup) =>
      group.name?.toLowerCase().includes(query) || 
      group.description?.toLowerCase().includes(query)
    );
    
    switch (activeFilter) {
      case 'travelers':
        return { users: filteredUsers, locations: [], groups: [] };
      case 'locations':
        return { users: [], locations: filteredLocations, groups: [] };
      case 'groups':
        return { users: [], locations: [], groups: filteredGroups };
      default:
        return { users: filteredUsers, locations: filteredLocations, groups: filteredGroups };
    }
  };
  
  const { users: displayUsers, locations: displayLocations, groups: displayGroups } = filteredData();
  
  const isLoading = isLoadingUsers || isLoadingLocations || isLoadingGroups;

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="relative">
        <div className="flex items-center border border-slate-700 rounded-lg bg-slate-800/50 overflow-hidden">
          <div className="p-3 text-slate-400">
            <Search size={20} />
          </div>
          <Input
            type="text"
            placeholder="Discover people, places, and groups..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)}>
        <TabsList className="grid grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-slate-700">All</TabsTrigger>
          <TabsTrigger value="travelers" className="data-[state=active]:bg-slate-700">Travelers</TabsTrigger>
          <TabsTrigger value="locations" className="data-[state=active]:bg-slate-700">Locations</TabsTrigger>
          <TabsTrigger value="groups" className="data-[state=active]:bg-slate-700">Groups</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Travelers Section */}
        {(activeFilter === 'all' || activeFilter === 'travelers') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center">
                <Users className="mr-2" size={20} />
                Travelers to Connect With
              </h3>
              {displayUsers.length > 3 && (
                <Button variant="ghost" size="sm">View All</Button>
              )}
            </div>
            
            {isLoadingUsers ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : displayUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayUsers.slice(0, 3).map((user: DiscoverUser) => (
                  <Card key={user._id} className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 border border-slate-600">
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.name} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600">
                              {user.name?.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          {user.travelStyles && user.travelStyles.length > 0 && (
                            <p className="text-sm text-slate-400">{user.travelStyles[0]} Traveler</p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-300">
                      {user.bio ? (
                        <p className="line-clamp-2">{user.bio}</p>
                      ) : (
                        <p className="italic text-slate-400">No bio available</p>
                      )}
                      {user.visitedCountries && user.visitedCountries.length > 0 && (
                        <p className="mt-2 flex items-center text-slate-400">
                          <Globe className="mr-1" size={14} />
                          <span>Visited {user.visitedCountries.length} countries</span>
                        </p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Connect
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="py-8 text-center text-slate-400">
                  <Users className="mx-auto h-12 w-12 mb-3 opacity-50" />
                  <p>No travelers found matching your search criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Popular Destinations Section */}
        {(activeFilter === 'all' || activeFilter === 'locations') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center">
                <MapPin className="mr-2" size={20} />
                Popular Destinations
              </h3>
              {displayLocations.length > 3 && (
                <Button variant="ghost" size="sm">Explore All</Button>
              )}
            </div>
            
            {isLoadingLocations ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden bg-slate-800/50 border-slate-700">
                    <Skeleton className="h-40 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full mt-1" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : displayLocations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayLocations.slice(0, 3).map((location: DiscoverLocation) => (
                  <Card key={location._id} className="overflow-hidden bg-slate-800/50 border-slate-700">
                    <div className="h-40 relative">
                      <img 
                        src={location.image} 
                        alt={location.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-slate-900/80 text-xs font-medium py-1 px-2 rounded-full flex items-center">
                        <Compass className="mr-1" size={12} />
                        {location.popularity}% Popular
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-1">{location.name}</h4>
                      <p className="text-sm text-slate-300 line-clamp-2">{location.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="py-8 text-center text-slate-400">
                  <MapPin className="mx-auto h-12 w-12 mb-3 opacity-50" />
                  <p>No destinations found matching your search criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Travel Groups Section */}
        {(activeFilter === 'all' || activeFilter === 'groups') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center">
                <Users className="mr-2" size={20} />
                Travel Groups
              </h3>
              {displayGroups.length > 2 && (
                <Button variant="ghost" size="sm">View All</Button>
              )}
            </div>
            
            {isLoadingGroups ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="flex flex-col md:flex-row overflow-hidden bg-slate-800/50 border-slate-700">
                    <Skeleton className="h-32 w-full md:w-32" />
                    <div className="p-4 flex-1">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3 mt-1" />
                      <div className="flex justify-between items-center mt-3">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : displayGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayGroups.slice(0, 2).map((group: DiscoverGroup) => (
                  <Card key={group._id} className="flex flex-col md:flex-row overflow-hidden bg-slate-800/50 border-slate-700">
                    <div className="h-32 md:w-32 bg-slate-700 relative">
                      {group.image ? (
                        <img 
                          src={group.image} 
                          alt={group.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                          <Users size={32} />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1">
                      <h4 className="font-medium mb-1">{group.name}</h4>
                      <p className="text-sm text-slate-300 line-clamp-2">{group.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-slate-400 flex items-center">
                          <Users className="mr-1" size={14} />
                          {group.memberCount.toLocaleString()} members
                        </span>
                        <Button size="sm">Join Group</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="py-8 text-center text-slate-400">
                  <Tag className="mx-auto h-12 w-12 mb-3 opacity-50" />
                  <p>No groups found matching your search criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverContent;
