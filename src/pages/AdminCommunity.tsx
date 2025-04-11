
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, UserX, Calendar, Edit, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CommunityComment {
  id: string;
  author: string;
  content: string;
  date: string;
  visible: boolean;
}

interface CommunityUser {
  id: string;
  name: string;
  email: string;
  joined: string;
  status: 'active' | 'blocked';
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'completed' | 'canceled';
}

const AdminCommunity = () => {
  // States for tabs
  const [activeTab, setActiveTab] = useState('comments');
  
  // Mock data for comments
  const [comments, setComments] = useState<CommunityComment[]>([
    {
      id: '1',
      author: 'Emma Wilson',
      content: "What's your favorite hidden gem in Europe?",
      date: '2 days ago',
      visible: true
    },
    {
      id: '2',
      author: 'David Chen',
      content: "I'm planning a trip to Southeast Asia next month.",
      date: '5 days ago',
      visible: true
    },
    {
      id: '3',
      author: 'Sarah Johnson',
      content: 'Solo female travel safety tips?',
      date: '1 week ago',
      visible: false
    }
  ]);
  
  // Mock data for users
  const [users, setUsers] = useState<CommunityUser[]>([
    {
      id: '1',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      joined: 'Apr 15, 2023',
      status: 'active'
    },
    {
      id: '2',
      name: 'David Chen',
      email: 'david@example.com',
      joined: 'Jun 3, 2023',
      status: 'active'
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      joined: 'Feb 12, 2023',
      status: 'blocked'
    }
  ]);
  
  // Mock data for events
  const [events, setEvents] = useState<CommunityEvent[]>([
    {
      id: '1',
      title: 'Virtual Photography Workshop',
      description: 'Learn travel photography techniques',
      dateTime: 'June 15, 2023\n7:00 PM - 9:00 PM EST',
      location: 'Online (Zoom)',
      attendees: 156,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'New York City Travelers Meetup',
      description: 'Networking event for NYC travelers',
      dateTime: 'July 8, 2023\n6:30 PM - 9:30 PM',
      location: 'The Explorers Club, Manhattan',
      attendees: 48,
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Sustainable Travel Webinar',
      description: 'Eco-friendly travel tips and destinations',
      dateTime: 'May 22, 2023\n12:00 PM - 1:30 PM EST',
      location: 'Online (Zoom)',
      attendees: 213,
      status: 'completed'
    }
  ]);

  // Dialog state for new event
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    isOnline: false
  });

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' } 
        : user
    ));
  };

  const handleToggleCommentVisibility = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, visible: !comment.visible } 
        : comment
    ));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleScheduleEvent = () => {
    // Create a new event with form data
    const id = Math.random().toString(36).substr(2, 9);
    const newEventObj: CommunityEvent = {
      id,
      title: newEvent.title,
      description: newEvent.description,
      dateTime: `${newEvent.date}\n${newEvent.time}`,
      location: newEvent.isOnline ? 'Online (Zoom)' : newEvent.location,
      attendees: 0,
      status: 'upcoming'
    };
    
    setEvents([...events, newEventObj]);
    setIsEventDialogOpen(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      isOnline: false
    });
  };

  return (
    <AdminLayout activeItem="community">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Community Management</h1>
        
        <Tabs defaultValue="comments" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comments" className="mt-6">
            <Table className="bg-white rounded-md border">
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map(comment => (
                  <TableRow key={comment.id}>
                    <TableCell>{comment.author}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{comment.content}</TableCell>
                    <TableCell>{comment.date}</TableCell>
                    <TableCell>
                      <Badge className={comment.visible ? "bg-green-500" : "bg-red-500"}>
                        {comment.visible ? "Visible" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleCommentVisibility(comment.id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <Table className="bg-white rounded-md border">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.joined}</TableCell>
                    <TableCell>
                      <Badge className={user.status === 'active' ? "bg-green-500" : "bg-red-500"}>
                        {user.status === 'active' ? "Active" : "Blocked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost"
                        className={user.status === 'active' ? "text-red-500" : "text-green-500"}
                        onClick={() => handleToggleUserStatus(user.id)}
                      >
                        {user.status === 'active' ? "Block" : "Unblock"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="events" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Community Events</h2>
              <Button 
                onClick={() => setIsEventDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Calendar className="mr-2 h-4 w-4" /> Schedule New Event
              </Button>
            </div>
            
            <Table className="bg-white rounded-md border">
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map(event => (
                  <TableRow key={event.id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell className="whitespace-pre-line">{event.dateTime}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.attendees}</TableCell>
                    <TableCell>
                      <Badge className={
                        event.status === 'upcoming' ? "bg-blue-500" : 
                        event.status === 'completed' ? "bg-gray-500" : "bg-red-500"
                      }>
                        {event.status === 'upcoming' ? "Upcoming" : 
                         event.status === 'completed' ? "Completed" : "Canceled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>

      {/* Schedule Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="event-title" className="text-sm font-medium">Event Title</label>
              <Input 
                id="event-title" 
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event Title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="event-description" className="text-sm font-medium">Event Description</label>
              <Textarea 
                id="event-description" 
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Event Description"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="event-date" className="text-sm font-medium">Select Date</label>
                <Input 
                  id="event-date" 
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="event-time" className="text-sm font-medium">Event Time</label>
                <Input 
                  id="event-time" 
                  placeholder="e.g., 7:00 PM - 9:00 PM EST"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <input 
                type="checkbox" 
                id="online-event" 
                checked={newEvent.isOnline}
                onChange={(e) => setNewEvent({ ...newEvent, isOnline: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="online-event" className="text-sm font-medium">This is an online event</label>
            </div>
            
            {!newEvent.isOnline && (
              <div className="space-y-2">
                <label htmlFor="event-location" className="text-sm font-medium">Physical location</label>
                <Input 
                  id="event-location" 
                  placeholder="Event location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleEvent} className="bg-blue-600 hover:bg-blue-700">
              Schedule Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCommunity;
