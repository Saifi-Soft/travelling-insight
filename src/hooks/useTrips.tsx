
import { useState, useEffect } from 'react';
import { useSession } from './useSession';
import { tripsApi } from '@/api/tripsApiService';
import { Trip } from '@/models/Trip';
import { useToast } from './use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useTrips() {
  const { session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get all trips for the logged in user
  const {
    data: trips,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['trips', session?.user?.id],
    queryFn: async () => {
      if (!session.user?.id) return [];
      return await tripsApi.getAllTrips(session.user.id);
    },
    enabled: !!session.user?.id
  });

  // Create mutation
  const createTripMutation = useMutation({
    mutationFn: (tripData: Omit<Trip, '_id' | 'editCount' | 'createdAt' | 'updatedAt'>) => 
      tripsApi.createTrip(tripData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', session?.user?.id] });
      toast({
        title: "Trip created",
        description: "Your trip has been successfully saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create trip",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update mutation
  const updateTripMutation = useMutation({
    mutationFn: ({ tripId, updates }: { tripId: string, updates: Partial<Trip['details']> }) => 
      tripsApi.updateTrip(tripId, session.user!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', session?.user?.id] });
      toast({
        title: "Trip updated",
        description: "Your trip has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update trip",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Cancel mutation
  const cancelTripMutation = useMutation({
    mutationFn: (tripId: string) => 
      tripsApi.cancelTrip(tripId, session.user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', session?.user?.id] });
      toast({
        title: "Trip cancelled",
        description: "Your trip has been cancelled.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to cancel trip",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete mutation
  const deleteTripMutation = useMutation({
    mutationFn: (tripId: string) => 
      tripsApi.deleteTrip(tripId, session.user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', session?.user?.id] });
      toast({
        title: "Trip deleted",
        description: "Your trip has been permanently deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete trip",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Check if user can create a new trip
  const checkCanCreateTrip = async (): Promise<boolean> => {
    if (!session.user?.id) return false;
    return await tripsApi.checkCreatePermission(session.user.id);
  };

  return {
    trips: trips || [],
    isLoading,
    error,
    refetchTrips: refetch,
    createTrip: createTripMutation.mutate,
    updateTrip: updateTripMutation.mutate,
    cancelTrip: cancelTripMutation.mutate,
    deleteTrip: deleteTripMutation.mutate,
    isCreating: createTripMutation.isPending,
    isUpdating: updateTripMutation.isPending,
    isCancelling: cancelTripMutation.isPending,
    isDeleting: deleteTripMutation.isPending,
    checkCanCreateTrip
  };
}
