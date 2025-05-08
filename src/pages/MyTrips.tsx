
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Edit, Trash2, Award, Info, Plane, Hotel, HelpingHand } from 'lucide-react';
import { format } from 'date-fns';
import { useSession } from '@/hooks/useSession';
import { useTrips } from '@/hooks/useTrips';
import { Trip } from '@/models/Trip';
import TripEditDialog from '@/components/travel/TripEditDialog';
import { useToast } from '@/hooks/use-toast';

const MyTrips: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const { toast } = useToast();
  const { 
    trips, 
    isLoading,
    error,
    cancelTrip,
    deleteTrip,
    checkCanCreateTrip
  } = useTrips();
  
  const [activeTab, setActiveTab] = useState<string>('all');
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [canCreateTrip, setCanCreateTrip] = useState(true);
  
  useEffect(() => {
    if (!session.isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to view your trips",
        variant: "destructive",
      });
      navigate("/login", { state: { from: "/my-trips" } });
    } else {
      // Check if user can create more trips
      const checkPermission = async () => {
        const canCreate = await checkCanCreateTrip();
        setCanCreateTrip(canCreate);
      };
      checkPermission();
    }
  }, [session, navigate, toast]);
  
  const filteredTrips = trips.filter(trip => {
    if (activeTab === 'all') return true;
    if (activeTab === 'planned') return trip.status === 'planned';
    if (activeTab === 'confirmed') return trip.status === 'confirmed';
    if (activeTab === 'cancelled') return trip.status === 'cancelled';
    if (activeTab === 'completed') return trip.status === 'completed';
    if (activeTab === 'hotel') return trip.type === 'hotel';
    if (activeTab === 'flight') return trip.type === 'flight';
    if (activeTab === 'guide') return trip.type === 'guide';
    return true;
  });

  const handleEditTrip = (trip: Trip) => {
    if (trip.editCount >= 3 && !session.user?.role) {
      setShowUpgradeDialog(true);
    } else {
      setTripToEdit(trip);
    }
  };

  const handleCancelTrip = (tripId: string) => {
    cancelTrip(tripId);
  };

  const handleConfirmDelete = () => {
    if (tripToDelete) {
      deleteTrip(tripToDelete);
      setTripToDelete(null);
    }
  };

  if (!session.isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">My Trips</h1>
              <p className="text-muted-foreground mt-1">
                Manage your travel plans and bookings
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={() => navigate('/travel/planner')}
                disabled={!canCreateTrip && trips.filter(t => t.status !== 'cancelled').length > 0}
              >
                Plan a New Trip
              </Button>
            </div>
          </div>
          
          {!canCreateTrip && trips.filter(t => t.status !== 'cancelled').length > 0 && (
            <Alert className="mb-6 border-amber-500">
              <Info className="h-4 w-4 text-amber-500" />
              <AlertTitle>Free account limit reached</AlertTitle>
              <AlertDescription>
                With a free account, you can only have one active trip at a time.{' '}
                <Button variant="link" onClick={() => setShowUpgradeDialog(true)} className="p-0 h-auto font-normal">
                  Upgrade your account
                </Button>{' '}
                to plan unlimited trips.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Trips</TabsTrigger>
              <TabsTrigger value="planned">Planned</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <div className="mb-4">
              <TabsList>
                <TabsTrigger value="hotel">
                  <Hotel className="mr-2 h-4 w-4" /> Hotels
                </TabsTrigger>
                <TabsTrigger value="flight">
                  <Plane className="mr-2 h-4 w-4" /> Flights
                </TabsTrigger>
                <TabsTrigger value="guide">
                  <HelpingHand className="mr-2 h-4 w-4" /> Guides
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-muted/30">
                      <CardHeader className="animate-pulse bg-muted h-8 mb-2" />
                      <CardContent className="space-y-2">
                        <div className="animate-pulse bg-muted h-4 w-3/4" />
                        <div className="animate-pulse bg-muted h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTrips.map((trip) => (
                    <TripCard 
                      key={trip._id} 
                      trip={trip} 
                      onEdit={() => handleEditTrip(trip)}
                      onCancel={() => handleCancelTrip(trip._id!)}
                      onDelete={() => setTripToDelete(trip._id!)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle>No trips found</CardTitle>
                    <CardDescription>
                      {trips.length === 0 
                        ? "You don't have any trips planned yet." 
                        : "No trips match the current filter."}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button onClick={() => navigate('/travel/planner')} disabled={!canCreateTrip}>
                      Plan a Trip
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Edit Trip Dialog */}
      {tripToEdit && (
        <TripEditDialog
          trip={tripToEdit}
          open={!!tripToEdit}
          onClose={() => setTripToEdit(null)}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!tripToDelete} onOpenChange={(open) => !open && setTripToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trip? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTripToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete Trip</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Upgrade Account Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-primary" />
              Upgrade Your Account
            </DialogTitle>
            <DialogDescription>
              Get unlimited trips and edits with a premium subscription.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span>Unlimited trips</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span>Unlimited edits</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span>Priority customer support</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Not Now
            </Button>
            <Button onClick={() => navigate('/community')}>
              View Plans
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

// TripCard component
interface TripCardProps {
  trip: Trip;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onEdit, onCancel, onDelete }) => {
  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeIcon = (type: Trip['type']) => {
    switch (type) {
      case 'hotel': return <Hotel className="h-4 w-4" />;
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'guide': return <HelpingHand className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className={trip.status === 'cancelled' ? 'opacity-70' : ''}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <CardTitle className="text-xl">{trip.details.title}</CardTitle>
            <CardDescription>{trip.details.destinationLocation}</CardDescription>
          </div>
          <Badge className={`${getStatusColor(trip.status)} capitalize`}>
            {trip.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="flex items-center text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Date
            </span>
            <span>
              {format(new Date(trip.details.startDate), 'MMM dd, yyyy')}
              {trip.details.endDate && ` - ${format(new Date(trip.details.endDate), 'MMM dd, yyyy')}`}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="flex items-center text-muted-foreground">
              {getTypeIcon(trip.type)}
              <span className="ml-2 capitalize">{trip.type}</span>
            </span>
            <span>
              {trip.type === 'hotel' && trip.details.hotelName}
              {trip.type === 'flight' && trip.details.airline}
              {trip.type === 'guide' && trip.details.guideName}
            </span>
          </div>
          
          {trip.details.price && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="font-medium">
                {trip.details.currency || 'USD'} {trip.details.price}
              </span>
            </div>
          )}

          {trip.editCount > 0 && trip.status !== 'cancelled' && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Edits made</span>
              <span>{trip.editCount}/3</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <Separator className="mb-3" />
      
      <CardFooter className="pt-0 flex justify-between">
        {trip.status !== 'cancelled' && trip.status !== 'completed' ? (
          <>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <Trash2 className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={onEdit} disabled={trip.status === 'cancelled'}>
              <Info className="mr-2 h-4 w-4" /> Details
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default MyTrips;
