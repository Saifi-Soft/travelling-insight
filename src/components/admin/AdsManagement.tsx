
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adPlacementsApi } from '@/api/adService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdPlacementDialog from './AdPlacementDialog';

const AdsManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<any>(null);
  
  // Fetch ad placements
  const { data: adPlacements = [], isLoading } = useQuery({
    queryKey: ['adPlacements'],
    queryFn: adPlacementsApi.getAll,
  });
  
  // Mutation for toggling ad enabled status
  const toggleAdMutation = useMutation({
    mutationFn: ({ id, isEnabled }: { id: string, isEnabled: boolean }) => {
      return adPlacementsApi.toggleEnabled(id, isEnabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adPlacements'] });
      toast({
        title: 'Ad placement updated',
        description: 'The ad placement has been updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update ad placement',
        variant: 'destructive',
      });
    },
  });
  
  // Mutation for deleting ad placement
  const deleteAdMutation = useMutation({
    mutationFn: (id: string) => {
      return adPlacementsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adPlacements'] });
      toast({
        title: 'Ad placement deleted',
        description: 'The ad placement has been deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete ad placement',
        variant: 'destructive',
      });
    },
  });
  
  const handleToggleEnabled = (id: string, isEnabled: boolean) => {
    toggleAdMutation.mutate({ id, isEnabled });
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this ad placement?')) {
      deleteAdMutation.mutate(id);
    }
  };
  
  const handleEdit = (placement: any) => {
    setSelectedPlacement(placement);
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setSelectedPlacement(null);
    setIsDialogOpen(true);
  };
  
  const handleSavePlacement = () => {
    queryClient.invalidateQueries({ queryKey: ['adPlacements'] });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Ad Placements</h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Placement
        </Button>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="h-60 flex items-center justify-center">
              <p className="text-muted-foreground">Loading ad placements...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adPlacements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No ad placements created yet</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  adPlacements.map((placement) => (
                    <TableRow key={placement.id}>
                      <TableCell className="font-medium">{placement.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{placement.type}</Badge>
                      </TableCell>
                      <TableCell>{placement.format}</TableCell>
                      <TableCell>{placement.location}</TableCell>
                      <TableCell>
                        <Switch
                          checked={placement.isEnabled}
                          onCheckedChange={(checked) => handleToggleEnabled(placement.id!, checked)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(placement)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(placement.id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Dialog for adding/editing ad placements */}
      <AdPlacementDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        placement={selectedPlacement}
        onSave={handleSavePlacement}
      />
    </div>
  );
};

export default AdsManagement;
