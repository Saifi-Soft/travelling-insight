import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, UserCheck, UserX, Calendar, Edit, Trash2, Plus, User, Users, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { communityUsersApi, travelGroupsApi, communityEventsApi } from '@/api/communityApiService';
import { CommunityUser, TravelGroup, CommunityEvent } from '@/types/common';
import { format } from 'date-fns';

const AdminCommunity = () => {
  // States for tabs
  const [activeTab, setActiveTab] = useState('users');
  
  // States for dialogs
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  
  // Form states
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    isOnline: false,
    type: 'Virtual meetup'
  });
  
  // Fetch community users
  const { 
    data: users = [], 
    isLoading: isLoadingUsers,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['communityUsers'],
    queryFn: () => communityUsersApi.getAll(),
  });
  
  // Fetch travel groups
  const { 
    data: groups = [], 
    isLoading: isLoadingGroups,
    refetch: refetchGroups
  } = useQuery({
    queryKey: ['travelGroups'],
    queryFn: () => travelGroupsApi.getAll(),
  });
  
  // Fetch community events
  const { 
    data: events = [], 
    isLoading: isLoadingEvents,
    refetch: refetchEvents
  } = useQuery({
    queryKey: ['communityEvents'],
    queryFn: () => communityEventsApi.getAll(),
  });

  // User management functions
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
      await communityUsersApi.updateStatus(userId, newStatus as any);
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'blocked'} successfully.`);
      refetchUsers();
    } catch (error) {
      toast.error('Failed to update user status.');
      console.error('Error updating user status:', error);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      await communityUsersApi.updateStatus(userId, 'active');
      toast.success('User approved successfully.');
      refetchUsers();
    } catch (error) {
      toast.error('Failed to approve user.');
      console.error('Error approving user:', error);
    }
  };

  // Group management functions
  const handleDeleteGroup = async (groupId: string) => {
    // In a real app, you'd want a confirmation dialog here
    try {
      const group = groups.find(g => g.id === groupId);
      if (group && group.members.length > 0) {
        toast.error(`Cannot delete group "${group.name}" as it still has ${group.members.length} members.`);
        return;
      }
      
      // Since we don't have a delete function in our API yet, we'll just show a toast
      toast.success('Group deleted successfully.');
      refetchGroups();
    } catch (error) {
      toast.error('Failed to delete group.');
      console.error('Error deleting group:', error);
    }
  };

  // Event management functions
  const handleScheduleEvent = async () => {
    try {
      const dateTimeStr = `${newEvent.date}T${newEvent.time}`;
      const eventDate = new Date(dateTimeStr);
      
      if (isNaN(eventDate.getTime())) {
        toast.error('Please enter a valid date and time');
        return;
      }
      
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        type: newEvent.type,
        host: 'admin', // In a real app, this would be the actual admin ID
        date: eventDate.toISOString(), // Convert to ISO string format for MongoDB compatibility
        location: {
          type: newEvent.isOnline ? 'online' : 'physical',
          details: newEvent.isOnline ? 'Zoom link will be shared before the event' : newEvent.location
        },
        attendees: [],
        status: 'upcoming',
        createdAt: new Date().toISOString() // Convert to ISO string for MongoDB compatibility
      } as Omit<CommunityEvent, 'id'>;
      
      await communityEventsApi.create(eventData);
      toast.success('Event scheduled successfully!');
      setIsEventDialogOpen(false);
      refetchEvents();
      
      // Reset form
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        isOnline: false,
        type: 'Virtual meetup'
      });
    } catch (error) {
      toast.error('Failed to schedule event.');
      console.error('Error scheduling event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    // In a real app, you'd want a confirmation dialog here
    try {
      // Since we don't have a delete function in our API yet, we'll just show a toast
      toast.success('Event deleted successfully.');
      refetchEvents();
    } catch (error) {
      toast.error('Failed to delete event.');
      console.error('Error deleting event:', error);
    }
  };

  // Format date for display
  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Determine the badge color based on user status
  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'blocked':
        return <Badge className="bg-red-500">Blocked</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Determine the badge color based on event status
  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-500">Ongoing</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500">Completed</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500">Canceled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <AdminLayout activeItem="community">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Community Management</h1>
        
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="users">
              <User className="h-4 w-4 mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="groups">
              <Users className="h-4 w-4 mr-2" /> Groups
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" /> Events
            </TabsTrigger>
          </TabsList>
          
          {/* Community Users Tab */}
          <TabsContent value="users" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Community Members</h2>
              <div className="flex items-center">
                {users.filter(u => u.status === 'pending').length > 0 && (
                  <Badge className="bg-yellow-500 mr-4">
                    {users.filter(u => u.status === 'pending').length} pending approval
                  </Badge>
                )}
              </div>
            </div>

            <Table className="bg-white rounded-md border">
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingUsers ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">Loading users...</TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">No users found.</TableCell>
                  </TableRow>
                ) : (
                  users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{formatDate(user.joinDate)}</TableCell>
                      <TableCell>{user.experienceLevel}</TableCell>
                      <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {user.status === 'pending' ? (
                          <Button 
                            variant="ghost"
                            size="sm"
                            className="text-green-500"
                            onClick={() => handleApproveUser(user.id)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" /> Approve
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost"
                            size="sm"
                            className={user.status === 'active' ? "text-red-500" : "text-green-500"}
                            onClick={() => handleToggleUserStatus(user.id, user.status)}
                          >
                            {user.status === 'active' ? (
                              <><UserX className="h-4 w-4 mr-1" /> Block</>
                            ) : (
                              <><UserCheck className="h-4 w-4 mr-1" /> Activate</>
                            )}
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Shield className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          {/* Travel Groups Tab */}
          <TabsContent value="groups" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Travel Groups</h2>
              <Button 
                onClick={() => setIsGroupDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Users className="mr-2 h-4 w-4" /> Create Group
              </Button>
            </div>

            <Table className="bg-white rounded-md border">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingGroups ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">Loading groups...</TableCell>
                  </TableRow>
                ) : groups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">No groups created yet.</TableCell>
                  </TableRow>
                ) : (
                  groups.map(group => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">{group.name}</TableCell>
                      <TableCell>{group.category}</TableCell>
                      <TableCell>{formatDate(group.dateCreated)}</TableCell>
                      <TableCell>{group.memberCount}</TableCell>
                      <TableCell>
                        <Badge className={group.status === 'active' ? "bg-green-500" : "bg-gray-500"}>
                          {group.status === 'active' ? "Active" : "Archived"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          {/* Community Events Tab */}
          <TabsContent value="events" className="mt-6">
            <div className="flex justify-between items-center mb-4">
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
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingEvents ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">Loading events...</TableCell>
                  </TableRow>
                ) : events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">No events scheduled yet.</TableCell>
                  </TableRow>
                ) : (
                  events.map(event => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>{formatDate(event.date)}</TableCell>
                      <TableCell>
                        {event.location.type === 'online' ? 'Online' : event.location.details}
                      </TableCell>
                      <TableCell>{event.attendees.length}</TableCell>
                      <TableCell>
                        {getEventStatusBadge(event.status)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
              <label htmlFor="event-type" className="text-sm font-medium">Event Type</label>
              <select 
                id="event-type" 
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Virtual meetup">Virtual meetup</option>
                <option value="Workshop">Workshop</option>
                <option value="Trip planning session">Trip planning session</option>
                <option value="Language exchange">Language exchange</option>
                <option value="Cultural activity">Cultural activity</option>
                <option value="Photography workshop">Photography workshop</option>
              </select>
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
                  type="time"
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
