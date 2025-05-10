
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Heart, Users, MapPin } from 'lucide-react';
import { TravelMatch } from '@/types/common';
import { travelMatchesApi } from '@/api/communityApiService';

interface IntelligentMatchingProps {
  userPreferences: {
    destinations: string[];
    travelStyles: string[];
    interests: string[];
  };
  userId: string;
}

// Extended TravelMatch type for UI needs
interface UITravelMatch extends TravelMatch {
  name: string;
  avatar: string;
  destinations: string[];
  travelStyles: string[];
  interests: string[];
}

const IntelligentMatching = ({ userPreferences, userId }: IntelligentMatchingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<UITravelMatch[]>([]);
  
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would call the database through an API
        // For now, we'll simulate it with mock data
        const mockMatches: UITravelMatch[] = [
          {
            id: '1',
            userId: 'm1',
            matchUserId: userId,
            name: 'Sarah Johnson',
            avatar: 'https://i.pravatar.cc/150?img=1',
            compatibilityScore: 85,
            destinations: ['Japan', 'Thailand', 'Vietnam'],
            travelStyles: ['Adventure', 'Cultural', 'Budget'],
            interests: ['Photography', 'Hiking', 'Local Food'],
            status: 'pending',
            createdAt: new Date().toISOString(),
            dates: {
              start: '2025-06-01',
              end: '2025-06-15'
            }
          },
          {
            id: '2',
            userId: 'm2',
            matchUserId: userId,
            name: 'Mike Chen',
            avatar: 'https://i.pravatar.cc/150?img=3',
            compatibilityScore: 76,
            destinations: ['Italy', 'Greece', 'Spain'],
            travelStyles: ['Luxury', 'Beach', 'Food & Wine'],
            interests: ['History', 'Architecture', 'Cuisine'],
            status: 'pending',
            createdAt: new Date().toISOString(),
            dates: {
              start: '2025-07-10',
              end: '2025-07-24'
            }
          },
          {
            id: '3',
            userId: 'm3',
            matchUserId: userId,
            name: 'Emma Wilson',
            avatar: 'https://i.pravatar.cc/150?img=5',
            compatibilityScore: 92,
            destinations: ['Japan', 'South Korea', 'Taiwan'],
            travelStyles: ['Cultural', 'City Life', 'Budget'],
            interests: ['Street Food', 'Museums', 'Shopping'],
            status: 'pending',
            createdAt: new Date().toISOString(),
            dates: {
              start: '2025-06-15',
              end: '2025-07-01'
            }
          }
        ];
        
        setMatches(mockMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
        toast.error('Failed to load potential matches');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMatches();
  }, [userId]);

  const handleConnectWithBuddy = (matchId: string) => {
    // Update the match status in the database
    toast.success('Connection request sent!');
    // Here you would typically call an API to update the status
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {matches.map((match) => (
        <Card key={match.id} className="border border-border bg-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-12 w-12">
                  {match.avatar ? (
                    <AvatarImage src={match.avatar} alt={match.name} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {match.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="ml-3">
                  <p className="font-semibold">{match.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {match.destinations[0] || 'No location set'}
                  </p>
                </div>
              </div>
              <Badge 
                className={
                  match.compatibilityScore >= 80 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-primary"
                }
              >
                {match.compatibilityScore}% Match
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-3 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Travel Styles</p>
              <div className="flex flex-wrap gap-1">
                {match.travelStyles.slice(0, 3).map((style, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {style}
                  </Badge>
                ))}
                {match.travelStyles.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{match.travelStyles.length - 3}
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Interests</p>
              <div className="flex flex-wrap gap-1">
                {match.interests.slice(0, 3).map((interest, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {match.interests.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{match.interests.length - 3}
                  </Badge>
                )}
              </div>
            </div>
            
            {match.dates && (
              <div className="flex items-center text-sm">
                <span>
                  {new Date(match.dates.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(match.dates.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant="default"
              onClick={() => handleConnectWithBuddy(match.id)}
            >
              <Heart className="h-4 w-4 mr-2" />
              Connect
            </Button>
          </CardFooter>
        </Card>
      ))}
      
      {matches.length === 0 && !isLoading && (
        <div className="col-span-2">
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <div className="mx-auto bg-secondary/50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No matches found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete your profile to get matched with compatible travel companions
              </p>
              <Button variant="outline">Update Preferences</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default IntelligentMatching;
