import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Heart, Users, MapPin } from 'lucide-react';
import { generateIntelligentMatches } from '@/utils/arrayUtils';
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

const IntelligentMatching = ({ userPreferences, userId }: IntelligentMatchingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<TravelMatch[]>([]);
  
  const findMatches = async () => {
    if (!userPreferences.destinations.length) {
      toast.error('Please add at least one destination to find matches');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Fetch potential matches from the API
      const potentialMatches = await travelMatchesApi.findPotentialMatches(userId, userPreferences);
      
      // Ensure all required properties are present in matches
      const validMatches: TravelMatch[] = potentialMatches.map(match => ({
        ...match,
        name: match.name || 'Anonymous Traveler',
        userId: match.userId,
        compatibilityScore: match.compatibilityScore,
        destinations: match.destinations,
        travelStyles: match.travelStyles,
        interests: match.interests
      }));
      
      setMatches(validMatches);
      
      if (validMatches.length === 0) {
        toast.info('No matching travel buddies found for your preferences yet');
      } else {
        toast.success(`Found ${validMatches.length} potential travel buddies!`);
      }
    } catch (error) {
      console.error('Error finding matches:', error);
      toast.error('Failed to find matches. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If we have preferences but no matches yet, automatically find matches
    if (userPreferences.destinations.length > 0 && matches.length === 0) {
      findMatches();
    }
  }, [userPreferences.destinations]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Your Travel Matches</h3>
        <Button 
          onClick={findMatches} 
          variant="outline" 
          disabled={isLoading || !userPreferences.destinations.length}
        >
          {isLoading ? 'Finding matches...' : 'Refresh Matches'}
        </Button>
      </div>
      
      {matches.length === 0 && !isLoading ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Matches Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add more destinations, interests or travel styles to find your perfect travel companions
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-muted"></div>
                    <div className="flex-1 ml-3 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            matches.map((match, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-start">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarImage src={match.avatar || `https://i.pravatar.cc/150?img=${index + 20}`} />
                      <AvatarFallback>{match.name?.[0] || 'T'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 ml-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{match.name}</CardTitle>
                        <Badge variant={match.compatibilityScore > 70 ? 'default' : 'secondary'}>
                          {match.compatibilityScore}% Match
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="text-xs">
                            {match.destinations.length} shared destinations
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Compatibility</span>
                        <span className="font-medium">{match.compatibilityScore}%</span>
                      </div>
                      <Progress value={match.compatibilityScore} className="h-1.5" />
                    </div>
                    
                    {match.interests && match.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {match.interests.slice(0, 3).map((interest: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {match.interests.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{match.interests.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline" className="w-full">
                    <Heart className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default IntelligentMatching;
