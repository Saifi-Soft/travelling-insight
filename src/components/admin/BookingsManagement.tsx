
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { travelService } from '@/api/travelService'; // Assuming this service exists
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Loader2, Eye, Plane, Hotel, HelpingHand,
  CalendarClock, ArrowUpDown, Check, X 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Type for bookings
type BookingType = 'flight' | 'hotel' | 'guide';
type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

interface Booking {
  id: string;
  type: BookingType;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  startDate: string;
  endDate?: string;
  amount: number;
  status: BookingStatus;
  reference: string;
  details: any; // Specific details based on booking type
}

const BookingsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<BookingType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all bookings
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: travelService.getAllBookings,
  });
  
  // Update booking status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) => 
      travelService.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update booking status: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Filter bookings based on search query and filters
  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      booking.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || booking.type === filterType;
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };
  
  const handleUpdateStatus = (id: string, status: BookingStatus) => {
    updateStatusMutation.mutate({ id, status });
  };
  
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
            <Check className="mr-1 h-3 w-3" /> Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
            <ArrowUpDown className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/20">
            <X className="mr-1 h-3 w-3" /> Cancelled
          </Badge>
        );
    }
  };
  
  const getTypeIcon = (type: BookingType) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-4 w-4 text-blue-500" />;
      case 'hotel':
        return <Hotel className="h-4 w-4 text-purple-500" />;
      case 'guide':
        return <HelpingHand className="h-4 w-4 text-green-500" />;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bookings Management</h2>
      </div>
      
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="flight">Flights</SelectItem>
            <SelectItem value="hotel">Hotels</SelectItem>
            <SelectItem value="guide">Tour Guides</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-red-500">Error loading bookings: {(error as Error).message}</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Travel Dates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings?.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {getTypeIcon(booking.type)}
                        <span className="ml-2 capitalize">{booking.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{booking.reference}</TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-xs text-muted-foreground">{booking.customerEmail}</div>
                    </TableCell>
                    <TableCell>{booking.bookingDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarClock className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span>{booking.startDate}</span>
                        {booking.endDate && <span> - {booking.endDate}</span>}
                      </div>
                    </TableCell>
                    <TableCell>${booking.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewBooking(booking)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {selectedBooking && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {getTypeIcon(selectedBooking.type)}
                <span className="ml-2">
                  Booking Details - {selectedBooking.reference}
                </span>
              </DialogTitle>
              <DialogDescription>
                {selectedBooking.type.charAt(0).toUpperCase() + selectedBooking.type.slice(1)} booking made on {selectedBooking.bookingDate}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium block">Name:</span>
                    <span>{selectedBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium block">Email:</span>
                    <span>{selectedBooking.customerEmail}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">Booking Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium block">Start Date:</span>
                    <span>{selectedBooking.startDate}</span>
                  </div>
                  {selectedBooking.endDate && (
                    <div>
                      <span className="text-sm font-medium block">End Date:</span>
                      <span>{selectedBooking.endDate}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium block">Total Amount:</span>
                    <span className="text-lg font-bold">${selectedBooking.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Booking Status</h3>
                <div className="space-y-4 mb-4">
                  <div>
                    <span className="text-sm font-medium block">Current Status:</span>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium block">Update Status:</span>
                    <div className="flex gap-2 mt-1">
                      <Button
                        size="sm"
                        variant={selectedBooking.status === 'confirmed' ? 'default' : 'outline'}
                        onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')}
                        className="flex-1"
                      >
                        <Check className="mr-1 h-4 w-4" /> Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedBooking.status === 'pending' ? 'default' : 'outline'}
                        onClick={() => handleUpdateStatus(selectedBooking.id, 'pending')}
                        className="flex-1"
                      >
                        <ArrowUpDown className="mr-1 h-4 w-4" /> Pending
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedBooking.status === 'cancelled' ? 'default' : 'outline'}
                        onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                        className="flex-1"
                      >
                        <X className="mr-1 h-4 w-4" /> Cancel
                      </Button>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">{selectedBooking.type.charAt(0).toUpperCase() + selectedBooking.type.slice(1)} Details</h3>
                {selectedBooking.type === 'flight' && (
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium block">Flight Number:</span>
                      <span>{selectedBooking.details.flightNumber}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">From:</span>
                      <span>{selectedBooking.details.origin}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">To:</span>
                      <span>{selectedBooking.details.destination}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">Passengers:</span>
                      <span>{selectedBooking.details.passengers}</span>
                    </div>
                  </div>
                )}
                
                {selectedBooking.type === 'hotel' && (
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium block">Hotel Name:</span>
                      <span>{selectedBooking.details.hotelName}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">Room Type:</span>
                      <span>{selectedBooking.details.roomType}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">Guests:</span>
                      <span>{selectedBooking.details.guests}</span>
                    </div>
                  </div>
                )}
                
                {selectedBooking.type === 'guide' && (
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium block">Guide Name:</span>
                      <span>{selectedBooking.details.guideName}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">Tour Type:</span>
                      <span>{selectedBooking.details.tourType}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">Group Size:</span>
                      <span>{selectedBooking.details.groupSize}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BookingsManagement;
