
import React, { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Users,
  Globe,
  CalendarDays,
  MapPin,
  Search,
  UserPlus,
  MessageSquare,
  PlusCircle,
  Calendar,
  Settings,
  Bell,
  Camera,
  Send,
  ThumbsUp,
  Heart,
  Share2,
  MessageCircle,
  Edit,
  Filter
} from 'lucide-react';
import { communityApi } from '@/api/communityApiService';

const CommunityHub: React.FC = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("feed");
  const [newPostContent, setNewPostContent] = useState("");
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: 'Solo travelers',
    topics: []
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'Virtual meetup',
    date: '',
    time: '',
    location: { type: 'online', details: '' }
  });

  // Fetch community data
  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['travelGroups'],
    queryFn: () => communityApi.groups.getAll()
  });

  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['communityEvents'],
    queryFn: () => communityApi.events.getAll()
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['communityUsers'],
    queryFn: () => communityApi.users.getAll()
  });

  // Create new post mutation
  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      // Mocked post creation - would connect to an API in a real app
      return { id: Date.now().toString(), content, createdAt: new Date().toISOString() };
    },
    onSuccess: () => {
      setNewPostContent("");
      toast.success("Post created successfully!");
      // In a real app, you would invalidate and refetch the posts query
    }
  });

  // Create new group mutation
  const createGroupMutation = useMutation({
    mutationFn: (group: any) => {
      return communityApi.groups.create({
        ...group,
        slug: group.name.toLowerCase().replace(/\s+/g, '-'),
        creator: session.user?.id || '',
        members: [session.user?.id || ''],
        dateCreated: new Date(),
        status: 'active',
        featuredStatus: false,
        memberCount: 1
      });
    },
    onSuccess: () => {
      setCreateGroupOpen(false);
      toast.success("Group created successfully!");
      queryClient.invalidateQueries({ queryKey: ['travelGroups'] });
    },
    onError: (error) => {
      toast.error("Failed to create group. Please try again.");
      console.error("Group creation error:", error);
    }
  });

  // Create new event mutation
  const createEventMutation = useMutation({
    mutationFn: (event: any) => {
      return communityApi.events.create({
        ...event,
        host: session.user?.id || '',
        date: new Date(event.date + 'T' + event.time),
        status: 'upcoming',
        attendees: [session.user?.id || ''],
        createdAt: new Date()
      });
    },
    onSuccess: () => {
      setCreateEventOpen(false);
      toast.success("Event created successfully!");
      queryClient.invalidateQueries({ queryKey: ['communityEvents'] });
    },
    onError: (error) => {
      toast.error("Failed to create event. Please try again.");
      console.error("Event creation error:", error);
    }
  });

  // Match with travel buddies mutation
  const findMatchesMutation = useMutation({
    mutationFn: () => {
      return communityApi.matches.findPotentialMatches(
        session.user?.id || '',
        { destinations: ['Italy', 'Japan', 'Thailand'] } // Mock preferences
      );
    },
    onSuccess: (data) => {
      toast.success(`Found ${data.length} potential travel buddies!`);
      // In a real app, you would update the UI with the matches
    }
  });

  // Handle post submission
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    createPostMutation.mutate(newPostContent);
  };

  // Handle group creation
  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.description) {
      toast.error("Name and description are required");
      return;
    }
    createGroupMutation.mutate(newGroup);
  };

  // Handle event creation
  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.time) {
      toast.error("Title, description, date and time are required");
      return;
    }
    createEventMutation.mutate(newEvent);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        {/* Community Hub Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 py-12 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Travel Community Hub</h1>
            <p className="text-xl max-w-2xl">
              Connect with fellow travelers, share experiences, and plan your next adventures together.
              Welcome back, {session.user?.name || "Traveler"}!
            </p>
          </div>
        </div>

        {/* Community Hub Navigation */}
        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="feed" onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-white shadow-sm">
                <TabsTrigger value="feed" className="px-5 py-3">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Feed
                </TabsTrigger>
                <TabsTrigger value="groups" className="px-5 py-3">
                  <Users className="mr-2 h-4 w-4" />
                  Groups
                </TabsTrigger>
                <TabsTrigger value="events" className="px-5 py-3">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="buddies" className="px-5 py-3">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Find Buddies
                </TabsTrigger>
              </TabsList>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Search community..." 
                  className="w-64 pl-10 bg-white shadow-sm" 
                />
              </div>
            </div>

            {/* Feed Tab */}
            <TabsContent value="feed" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Create Post */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Share with the community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePostSubmit}>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <img src="https://i.pravatar.cc/100" alt="User" />
                        </Avatar>
                        <div className="flex-1">
                          <Textarea 
                            placeholder="Share your travel experiences, tips or questions..."
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            className="resize-none"
                            rows={3}
                          />
                          <div className="flex justify-between mt-3">
                            <div className="flex gap-2">
                              <Button type="button" variant="ghost" size="sm">
                                <Camera size={16} className="mr-1" />
                                Photo
                              </Button>
                              <Button type="button" variant="ghost" size="sm">
                                <MapPin size={16} className="mr-1" />
                                Location
                              </Button>
                            </div>
                            <Button 
                              type="submit" 
                              disabled={!newPostContent.trim()}
                            >
                              <Send size={16} className="mr-2" />
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Sample Posts */}
                {[1, 2, 3].map((post) => (
                  <Card key={post} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <img src={`https://i.pravatar.cc/100?img=${post + 10}`} alt="User" />
                          </Avatar>
                          <div>
                            <p className="font-medium">{["Sarah Johnson", "Michael Chen", "Emma Wilson"][post - 1]}</p>
                            <p className="text-xs text-gray-500">Posted 2 hours ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                          </svg>
                        </Button>
                      </div>
                    </CardHeader>
                    <div className="px-6">
                      <p className="mb-4">
                        {[
                          "Just returned from an amazing trip to Portugal! The beaches in Algarve are absolutely stunning. Has anyone been to Benagil Cave? The boat tour was the highlight of my trip!",
                          "Looking for recommendations for budget-friendly accommodations in Tokyo. Planning a 2-week trip in November. Any suggestions from those who've been there recently?",
                          "Visited Chiang Mai's elephant sanctuary yesterday. Such a moving experience to see these magnificent animals in a humane environment. I highly recommend visiting if you're in northern Thailand!"
                        ][post - 1]}
                      </p>
                      
                      {post === 1 && (
                        <div className="relative w-full h-64 mb-4 rounded-md overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1545158539-c5c58f7d8375" 
                            alt="Portugal beaches" 
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <CardFooter className="border-t flex justify-between py-3">
                      <div className="flex gap-4">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp size={16} className="mr-1" />
                          {[24, 18, 32][post - 1]} Likes
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle size={16} className="mr-1" />
                          {[8, 5, 12][post - 1]} Comments
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 size={16} className="mr-1" />
                        Share
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Community Stats Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Community Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Members</span>
                      <span className="font-semibold">2,456</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Groups</span>
                      <span className="font-semibold">57</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Upcoming Events</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Countries Represented</span>
                      <span className="font-semibold">94</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Groups Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Groups</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {['Solo Female Travelers', 'Digital Nomads', 'Adventure Seekers'].map((group, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                          {i === 0 ? <Users size={18} /> : i === 1 ? <Globe size={18} /> : <MapPin size={18} />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{group}</p>
                          <p className="text-xs text-gray-500">{[583, 429, 356][i]} members</p>
                        </div>
                        <Button className="ml-auto" size="sm" variant="outline">
                          Join
                        </Button>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full text-center" size="sm">
                      View All Groups
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Events Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {['Travel Photography Workshop', 'Tokyo Meetup', 'Backpacking Tips Webinar'].map((event, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{event}</p>
                          <p className="text-xs text-gray-500">
                            {['Sep 15', 'Oct 3', 'Sep 28'][i]} • {['Online', 'In-person', 'Online'][i]}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full text-center" size="sm">
                      View All Events
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Groups Tab */}
            <TabsContent value="groups">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Travel Groups</h2>
                <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle size={16} className="mr-2" />
                      Create Group
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create a New Travel Group</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleGroupSubmit} className="space-y-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">Group Name</label>
                        <Input 
                          id="name" 
                          value={newGroup.name}
                          onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                          placeholder="e.g., Solo Travelers Europe"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="category" className="text-sm font-medium">Category</label>
                        <select 
                          id="category"
                          value={newGroup.category}
                          onChange={(e) => setNewGroup({...newGroup, category: e.target.value})}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option>Solo travelers</option>
                          <option>Family travel</option>
                          <option>Budget travel</option>
                          <option>Luxury travel</option>
                          <option>Adventure travel</option>
                          <option>Digital nomads</option>
                          <option>Photography enthusiasts</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="description" className="text-sm font-medium">Description</label>
                        <Textarea 
                          id="description" 
                          value={newGroup.description}
                          onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                          placeholder="Describe what your group is about..."
                          rows={4}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="topics" className="text-sm font-medium">Topics (comma separated)</label>
                        <Input 
                          id="topics" 
                          placeholder="e.g., hostels, train travel, street food"
                          onChange={(e) => setNewGroup({...newGroup, topics: e.target.value.split(',')})}
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setCreateGroupOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Create Group</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex mb-6 items-center">
                <Button variant="outline" size="sm" className="mr-2">
                  <Filter size={14} className="mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="mr-4">
                  Latest
                </Button>
                <Input 
                  placeholder="Search groups..." 
                  className="max-w-xs" 
                />
              </div>

              {/* Groups Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingGroups ? (
                  <p>Loading groups...</p>
                ) : (
                  Array.isArray(groups) && groups.length > 0 ? (
                    groups.map((group: any, index: number) => (
                      <Card key={group.id || index}>
                        <div className="h-36 bg-gradient-to-r from-blue-400 to-indigo-500 relative">
                          {group.image && (
                            <img 
                              src={group.image} 
                              alt={group.name} 
                              className="h-full w-full object-cover absolute inset-0"
                            />
                          )}
                          <div className="absolute bottom-3 left-3 bg-black/70 text-white py-1 px-3 text-xs rounded-full">
                            {group.category}
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle>{group.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {group.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500">
                            <Users className="inline-block mr-1 h-4 w-4" />
                            {group.memberCount || group.members?.length || 0} members
                          </p>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                          <Button className="w-full">Join Group</Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    [1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i}>
                        <div className={`h-36 bg-gradient-to-r from-blue-${i*100} to-indigo-${i*100} relative`}></div>
                        <CardHeader>
                          <CardTitle>
                            {[
                              "Backpackers Unite",
                              "Solo Female Travelers",
                              "Digital Nomads Collective",
                              "Adventure Seekers",
                              "Luxury Travel Enthusiasts",
                              "Family Travel Tips"
                            ][i-1]}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {[
                              "A community for budget travelers sharing tips and experiences from around the world.",
                              "Safe and supportive community for women traveling solo.",
                              "Remote workers who travel the world while maintaining careers.",
                              "For those seeking adrenaline and unique experiences in travel.",
                              "Discussing the finer things in travel - from 5-star hotels to michelin dining.",
                              "Tips and tricks for traveling with children of all ages."
                            ][i-1]}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500">
                            <Users className="inline-block mr-1 h-4 w-4" />
                            {[578, 1025, 763, 489, 312, 647][i-1]} members
                          </p>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                          <Button className="w-full">Join Group</Button>
                        </CardFooter>
                      </Card>
                    ))
                  )
                )}
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Community Events</h2>
                <Dialog open={createEventOpen} onOpenChange={setCreateEventOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle size={16} className="mr-2" />
                      Create Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create a Community Event</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEventSubmit} className="space-y-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="event-title" className="text-sm font-medium">Event Title</label>
                        <Input 
                          id="event-title" 
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                          placeholder="e.g., Travel Photography Workshop"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="event-type" className="text-sm font-medium">Event Type</label>
                        <select 
                          id="event-type"
                          value={newEvent.type}
                          onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option>Virtual meetup</option>
                          <option>Workshop</option>
                          <option>Group trip</option>
                          <option>Local meetup</option>
                          <option>Conference</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="event-description" className="text-sm font-medium">Description</label>
                        <Textarea 
                          id="event-description" 
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                          placeholder="Describe what your event is about..."
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label htmlFor="event-date" className="text-sm font-medium">Date</label>
                          <Input
                            id="event-date" 
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="event-time" className="text-sm font-medium">Time</label>
                          <Input
                            id="event-time" 
                            type="time"
                            value={newEvent.time}
                            onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Location Type</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="location-type"
                              checked={newEvent.location.type === 'online'}
                              onChange={() => setNewEvent({
                                ...newEvent, 
                                location: {...newEvent.location, type: 'online'}
                              })}
                              className="h-4 w-4"
                            />
                            <span>Online</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="location-type"
                              checked={newEvent.location.type === 'physical'}
                              onChange={() => setNewEvent({
                                ...newEvent, 
                                location: {...newEvent.location, type: 'physical'}
                              })}
                              className="h-4 w-4"
                            />
                            <span>Physical Location</span>
                          </label>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="location-details" className="text-sm font-medium">
                          {newEvent.location.type === 'online' ? 'Meeting Link' : 'Address'}
                        </label>
                        <Input 
                          id="location-details" 
                          value={newEvent.location.details}
                          onChange={(e) => setNewEvent({
                            ...newEvent, 
                            location: {...newEvent.location, details: e.target.value}
                          })}
                          placeholder={newEvent.location.type === 'online' 
                            ? "e.g., Zoom link or meeting ID" 
                            : "e.g., 123 Main St, New York, NY"
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setCreateEventOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Create Event</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex mb-6 items-center">
                <Button variant="outline" size="sm" className="mr-2">
                  <Filter size={14} className="mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="mr-2">
                  Upcoming
                </Button>
                <Button variant="outline" size="sm" className="mr-4">
                  All Events
                </Button>
                <Input 
                  placeholder="Search events..." 
                  className="max-w-xs" 
                />
              </div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingEvents ? (
                  <p>Loading events...</p>
                ) : (
                  Array.isArray(events) && events.length > 0 ? (
                    events.map((event: any, index: number) => (
                      <Card key={event.id || index}>
                        <CardHeader className="relative pb-0">
                          <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-medium py-1 px-2 rounded">
                            {event.type}
                          </div>
                          <div className="h-40 bg-gray-100 rounded-t-lg overflow-hidden">
                            {event.image ? (
                              <img 
                                src={event.image} 
                                alt={event.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-purple-300 to-blue-300 flex items-center justify-center">
                                <Calendar size={48} className="text-white" />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <CalendarDays size={14} />
                            <span>{new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} />
                            <span>{event.location?.type === 'online' ? 'Online Event' : event.location?.details || 'Location TBD'}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <Avatar key={i} className="h-6 w-6 border-2 border-white">
                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Attendee" />
                              </Avatar>
                            ))}
                            <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{event.attendees?.length || Math.floor(Math.random() * 20) + 5}</span>
                            </div>
                          </div>
                          <Button>RSVP Now</Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    [1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i}>
                        <CardHeader className="relative pb-0">
                          <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-medium py-1 px-2 rounded">
                            {['Virtual meetup', 'Workshop', 'Local meetup', 'Workshop', 'Conference', 'Group trip'][i-1]}
                          </div>
                          <div className="h-40 bg-gradient-to-r from-purple-300 to-blue-300 rounded-t-lg overflow-hidden flex items-center justify-center">
                            <Calendar size={48} className="text-white" />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <h3 className="font-semibold text-lg mb-2">
                            {[
                              "Travel Photography Workshop",
                              "Tokyo Traveler Meetup",
                              "Backpacking Tips & Tricks",
                              "Language Exchange for Travelers",
                              "Annual Travel Blogger Conference",
                              "Weekend Hiking Trip"
                            ][i-1]}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {[
                              "Learn how to take stunning travel photos with professional photographer Alex Rivera.",
                              "Connect with other travelers planning to visit Japan this year.",
                              "Essential tips for backpacking through Southeast Asia on a budget.",
                              "Practice language skills with native speakers before your next trip.",
                              "Join travel bloggers from around the world for workshops and networking.",
                              "Join us for a weekend hiking trip in the beautiful mountains."
                            ][i-1]}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <CalendarDays size={14} />
                            <span>{['Sep 15', 'Oct 3', 'Sep 28', 'Oct 10', 'Nov 5', 'Oct 21'][i-1]}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} />
                            <span>{['Online', 'Tokyo, Japan', 'Online', 'Online', 'Barcelona, Spain', 'Yosemite, CA'][i-1]}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4 flex justify-between">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((j) => (
                              <Avatar key={j} className="h-6 w-6 border-2 border-white">
                                <img src={`https://i.pravatar.cc/100?img=${i + j + 10}`} alt="Attendee" />
                              </Avatar>
                            ))}
                            <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{[24, 18, 32, 15, 42, 19][i-1]}</span>
                            </div>
                          </div>
                          <Button>RSVP Now</Button>
                        </CardFooter>
                      </Card>
                    ))
                  )
                )}
              </div>
            </TabsContent>

            {/* Find Buddies Tab */}
            <TabsContent value="buddies">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Find Travel Buddies</h2>
                <p className="text-gray-600">
                  Connect with like-minded travelers who share your interests and travel style.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  {/* Matching Preferences Card */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Your Travel Preferences</CardTitle>
                      <CardDescription>
                        Update your preferences to find better matches
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Destinations of Interest</label>
                          <Input placeholder="e.g., Japan, Italy, Thailand" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">When do you plan to travel?</label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input type="date" placeholder="Start date" />
                            <Input type="date" placeholder="End date" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Travel Style</label>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                            <option>Budget</option>
                            <option>Mid-range</option>
                            <option>Luxury</option>
                            <option>Adventure</option>
                            <option>Cultural</option>
                            <option>Relaxation</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Age Range</label>
                          <div className="grid grid-cols-2 gap-2">
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                              <option>18</option>
                              <option>20</option>
                              <option>25</option>
                              <option>30</option>
                              <option>35</option>
                              <option>40</option>
                              <option>45</option>
                              <option>50+</option>
                            </select>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                              <option>25</option>
                              <option>30</option>
                              <option>35</option>
                              <option>40</option>
                              <option>45</option>
                              <option>50</option>
                              <option>55</option>
                              <option>60+</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="mt-6" 
                        onClick={() => findMatchesMutation.mutate()}
                      >
                        Find Travel Buddies
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Matching Results */}
                  <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-1/3 bg-gray-100">
                            <div className="h-full flex items-center justify-center p-6">
                              <Avatar className="h-32 w-32">
                                <img src={`https://i.pravatar.cc/300?img=${i + 20}`} alt="Travel buddy" />
                              </Avatar>
                            </div>
                          </div>
                          <div className="sm:w-2/3 p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {["Alex Rivera", "Emma Watson", "David Kim", "Sophia Chen", "Michael Brown"][i-1]}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {["Barcelona, Spain", "London, UK", "Seoul, South Korea", "Toronto, Canada", "Sydney, Australia"][i-1]}
                                </p>
                                <div className="mt-1 flex items-center">
                                  <div className="text-amber-500 flex">
                                    {[...Array(5)].map((_, j) => (
                                      <svg
                                        key={j}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className={`w-4 h-4 ${j < [4, 5, 4, 3, 5][i-1] ? "text-amber-500" : "text-gray-300"}`}
                                      >
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="ml-1 text-xs text-gray-500">{[4, 5, 4, 3, 5][i-1]}/5 rating</span>
                                </div>
                              </div>
                              <div className="bg-green-100 text-green-800 text-sm font-medium py-1 px-2 rounded">
                                {[82, 95, 79, 88, 91][i-1]}% Match
                              </div>
                            </div>
                            <div className="mt-4">
                              <h4 className="text-sm font-medium">Travel Interests</h4>
                              <div className="mt-1 flex flex-wrap gap-2">
                                {[
                                  ["Photography", "Hiking", "Local cuisine", "Museums"],
                                  ["Architecture", "History", "Art galleries", "Shopping"],
                                  ["Street food", "Temples", "Nature", "City exploration"],
                                  ["Hiking", "Wildlife", "Camping", "Photography"],
                                  ["Beaches", "Diving", "Sailing", "Wildlife"]
                                ][i-1].map((interest, j) => (
                                  <span 
                                    key={j} 
                                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                                  >
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button size="sm">Send Message</Button>
                              <Button size="sm" variant="outline">View Profile</Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Travel Buddy Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Travel Buddy Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Safety First</h4>
                        <p className="text-sm text-gray-600">
                          Always meet in public places and let someone know about your plans.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Be Clear About Expectations</h4>
                        <p className="text-sm text-gray-600">
                          Discuss travel styles, budgets, and interests before committing to travel together.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Start Small</h4>
                        <p className="text-sm text-gray-600">
                          Consider a day trip before committing to longer travel plans.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Success Stories */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Success Stories</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <img src={`https://i.pravatar.cc/100?img=${i + 50}`} alt="User" />
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {["Maria & John", "The Adventure Trio"][i-1]}
                              </p>
                              <p className="text-xs text-gray-500">
                                {["Traveled to Greece", "Explored Southeast Asia"][i-1]}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 italic">
                            {[
                              "We met through the buddy finder and ended up having an amazing two-week trip in the Greek islands!",
                              "Three strangers became lifelong friends after our backpacking adventure through Thailand, Vietnam and Cambodia."
                            ][i-1]}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityHub;
