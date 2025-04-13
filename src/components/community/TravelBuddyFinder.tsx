
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { MapPin, Calendar, Users, Filter, Plane, UserPlus, Clock, CheckCircle } from 'lucide-react';
import { mongoApiService } from '@/api/mongoApiService';
import { communityApi } from '@/api/communityApiService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TravelBuddyRequest {
  _id?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelStyle: string[];
  description: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface BuddyMatch {
  _id?: string;
  userId: string;
  name: string;
  avatar?: string;
  destination: string;
  dates: {
    start: string;
    end: string;
  };
  compatibilityScore: number;
  travelStyles: string[];
  interests: string[];
  languages: string[];
}

const TravelBuddyFinder = () => {
  const [activeTab, setActiveTab] = useState('find');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [compatibilityThreshold, setCompatibilityThreshold] = useState([60]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  
  const userId = localStorage.getItem('community_user_id') || '';
  const userName = localStorage.getItem('userName') || 'Anonymous';

  // Fetch travel buddy requests
  const { data: requests = [], isLoading: isRequestsLoading } = useQuery({
    queryKey: ['travelBuddyRequests'],
    queryFn: () => mongoApiService.queryDocuments('travelBuddyRequests', {}),
  });

  // Fetch potential matches based on user profile
  const { data: matches = [], isLoading: isMatchesLoading } = useQuery({
    queryKey: ['travelBuddyMatches', userId],
    queryFn: () => {
      // In a real application, this would call a sophisticated matching algorithm
      return communityApi.matches.findPotentialMatches(userId, { destinations: ['Japan', 'Greece', 'Italy'] });
    },
    enabled: !!userId
  });

  const { data: travelStyles = [] } = useQuery({
    queryKey: ['travelStyles'],
    queryFn: () => {
      // Normally we would fetch this from the database
      return [
        'Adventure',
        'Beach',
        'Cultural',
        'Eco-friendly',
        'Food & Wine',
        'Luxury',
        'Budget',
        'Backpacking',
        'Solo',
        'Family',
        'Road Trip'
      ];
    }
  });

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destination || !startDate || !endDate || selectedStyles.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Here you would normally call your API to create the request
    toast.success('Your travel buddy request has been posted!');
    
    // Reset form
    setDestination('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setSelectedStyles([]);
    setActiveTab('browse');
  };

  const handleConnectWithBuddy = (buddyId: string) => {
    toast.success('Connection request sent!');
    // Here you would implement the actual connection logic
  };

  const handleToggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style) 
        : [...prev, style]
    );
  };

  const filteredRequests = requests.filter((request: TravelBuddyRequest) => 
    request.status === 'active' && request.userId !== userId
  );

  const filteredMatches = matches.filter((match: BuddyMatch) => 
    match.compatibilityScore >= compatibilityThreshold[0]
  );

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-border">
          <div className="px-4 py-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="matches">
                <CheckCircle className="h-4 w-4 mr-2 hidden sm:inline" />
                Matches
              </TabsTrigger>
              <TabsTrigger value="browse">
                <Users className="h-4 w-4 mr-2 hidden sm:inline" />
                Browse
              </TabsTrigger>
              <TabsTrigger value="find">
                <Plane className="h-4 w-4 mr-2 hidden sm:inline" />
                Create
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        {/* Smart Matches Tab */}
        <TabsContent value="matches" className="p-4">
          {isMatchesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="ml-3">
                          <Skeleton className="h-5 w-28" />
                          <Skeleton className="h-4 w-20 mt-1" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-16 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredMatches.length > 0 ? (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium mb-1">Compatibility Filter</h3>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={compatibilityThreshold}
                      onValueChange={setCompatibilityThreshold}
                      max={100}
                      step={5}
                      className="w-[200px]"
                    />
                    <span className="text-sm font-medium">{compatibilityThreshold}%+</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  More Filters
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMatches.map((match: BuddyMatch) => (
                  <Card key={match._id} className="border border-border bg-card/50">
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
                              {match.destination}
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
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
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
                        onClick={() => handleConnectWithBuddy(match.userId)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <div className="mx-auto bg-secondary/50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No matches found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete your profile to get matched with compatible travel companions
                </p>
                <Button variant="outline" onClick={() => setActiveTab('find')}>
                  Create a travel request
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Browse Requests Tab */}
        <TabsContent value="browse" className="p-4">
          {isRequestsLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-20 w-full" />
                        <div className="flex gap-2 flex-wrap">
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-24 rounded-full" />
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Skeleton className="h-9 w-32" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="space-y-4">
              {filteredRequests.map((request: TravelBuddyRequest) => (
                <Card key={request._id} className="border border-border bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14">
                        {request.userAvatar ? (
                          <AvatarImage src={request.userAvatar} alt={request.userName} />
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {request.userName.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{request.userName}</h3>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(request.createdAt).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-1 mb-2 text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="font-medium">{request.destination}</span>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>
                            {new Date(request.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(request.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        
                        <p className="mb-3 text-sm">{request.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {request.travelStyle.map((style, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {style}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.info('Message feature coming soon!')}
                          >
                            Message
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleConnectWithBuddy(request.userId)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <div className="mx-auto bg-secondary/50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">No travel requests found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Be the first to create a travel buddy request
                </p>
                <Button onClick={() => setActiveTab('find')}>
                  Create Request
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Create Request Tab */}
        <TabsContent value="find" className="p-4">
          <Card className="border border-border bg-card/50">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold">Find a Travel Buddy</h3>
              <p className="text-sm text-muted-foreground">Post your travel plans and connect with like-minded travelers</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="destination"
                      placeholder="Where are you going?"
                      className="pl-10 bg-secondary/50"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="startDate"
                        type="date"
                        className="pl-10 bg-secondary/50"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="endDate"
                        type="date"
                        className="pl-10 bg-secondary/50"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Travel Style (select all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {travelStyles.map((style) => (
                      <Badge
                        key={style}
                        variant={selectedStyles.includes(style) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleToggleStyle(style)}
                      >
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell potential travel buddies about your plans, preferences, and what you're looking for..."
                    className="min-h-[100px] bg-secondary/50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Privacy Settings</Label>
                  <Select defaultValue="public">
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Visible to all travelers</SelectItem>
                      <SelectItem value="connections">Connections Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Post Travel Request
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card className="bg-secondary/20 border-dashed">
              <CardContent className="p-4 text-center">
                <h4 className="font-semibold mb-2">Finding the Right Travel Buddy</h4>
                <ul className="text-sm text-muted-foreground text-left list-disc pl-5 space-y-1">
                  <li>Be specific about your travel dates and preferences</li>
                  <li>Include your planned activities and accommodation style</li>
                  <li>Mention languages you speak and your travel experience</li>
                  <li>Always chat and video call before making travel arrangements</li>
                  <li>Consider a short meetup before committing to longer travels</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelBuddyFinder;
