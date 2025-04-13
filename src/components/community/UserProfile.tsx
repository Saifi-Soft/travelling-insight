
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, Award, Users, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { communityApi } from '@/api/communityApiService';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

const UserProfile = () => {
  const userId = localStorage.getItem('community_user_id');
  const userName = localStorage.getItem('userName') || 'Demo User';
  
  const { data: userData, isLoading } = useQuery({
    queryKey: ['communityUser', userId],
    queryFn: () => userId ? communityApi.users.getById(userId) : null,
    enabled: !!userId,
  });

  // Default user data for demo purposes if not found
  const user = userData || {
    name: userName,
    avatar: null,
    experienceLevel: 'Casual',
    joinDate: new Date().toISOString(),
    travelStyles: ['Adventure', 'Budget', 'Solo'],
    reputation: 42,
    visitedCountries: [
      { name: 'France', year: 2022 },
      { name: 'Japan', year: 2023 },
      { name: 'Italy', year: 2021 }
    ],
    wishlistDestinations: ['Iceland', 'Thailand', 'New Zealand'],
    badges: [
      { name: 'Early Adopter', description: 'Joined during beta', icon: '🌟' },
      { name: 'Adventurer', description: '5+ adventure posts', icon: '🏔️' }
    ]
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3 relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
        <div className="pt-16 flex flex-col items-center">
          {isLoading ? (
            <Skeleton className="h-24 w-24 rounded-full" />
          ) : (
            <Avatar className="h-24 w-24 border-4 border-white">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="bg-primary text-white text-2xl h-full w-full flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
              )}
            </Avatar>
          )}
          
          {isLoading ? (
            <div className="mt-4 space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <>
              <CardTitle className="mt-4">{user.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1 text-gray-500">
                <Badge variant="outline">{user.experienceLevel}</Badge>
                <span>•</span>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span className="text-xs">
                    Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {user.travelStyles.map((style) => (
                <Badge key={style} variant="secondary">{style}</Badge>
              ))}
            </div>
            
            <div className="flex justify-around text-center py-4">
              <div>
                <div className="text-xl font-bold">{user.visitedCountries?.length || 0}</div>
                <div className="text-sm text-gray-500">Countries</div>
              </div>
              <div>
                <div className="text-xl font-bold">{user.reputation}</div>
                <div className="text-sm text-gray-500">Reputation</div>
              </div>
              <div>
                <div className="text-xl font-bold">{user.badges?.length || 0}</div>
                <div className="text-sm text-gray-500">Badges</div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4" /> Visited Countries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.visitedCountries?.map((country, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      {country.name} ({country.year})
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" /> Wishlist
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.wishlistDestinations?.map((destination, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      {destination}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4" /> Badges
                </h3>
                <div className="flex flex-wrap gap-3">
                  {user.badges?.map((badge, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-lg">{badge.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{badge.name}</div>
                        <div className="text-xs text-gray-500">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="outline" className="w-full">Edit Profile</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
