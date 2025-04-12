
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adPlacementsApi, AdPlacement } from '@/api/adService';
import { toast } from '@/components/ui/use-toast';

interface AdPlacementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement?: AdPlacement | null;
  onSave: () => void;
}

const AD_TYPES = [
  { value: 'header', label: 'Header' },
  { value: 'footer', label: 'Footer' },
  { value: 'sidebar', label: 'Sidebar' },
  { value: 'in-content', label: 'In Content' },
  { value: 'between-posts', label: 'Between Posts' },
  { value: 'custom', label: 'Custom' }
];

const AD_FORMATS = [
  { value: 'auto', label: 'Auto' },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'rectangle', label: 'Rectangle' }
];

const LOCATIONS = [
  { value: 'all-pages', label: 'All Pages' },
  { value: 'home', label: 'Home Page' },
  { value: 'blog', label: 'Blog Pages' },
  { value: 'travel', label: 'Travel Pages' },
  { value: 'community', label: 'Community Pages' }
];

const AdPlacementDialog = ({ open, onOpenChange, placement, onSave }: AdPlacementDialogProps) => {
  const [name, setName] = useState('');
  const [slot, setSlot] = useState('');
  const [type, setType] = useState<any>('between-posts');
  const [format, setFormat] = useState<any>('auto');
  const [location, setLocation] = useState<string>('all-pages');
  const [isEnabled, setIsEnabled] = useState(true);
  const [position, setPosition] = useState('');
  const [isResponsive, setIsResponsive] = useState(true);
  const [customCode, setCustomCode] = useState('');
  
  const queryClient = useQueryClient();
  
  // Reset form when dialog opens/closes or placement changes
  useEffect(() => {
    if (placement) {
      setName(placement.name || '');
      setSlot(placement.slot || '');
      setType(placement.type || 'between-posts');
      setFormat(placement.format || 'auto');
      setLocation(placement.location || 'all-pages');
      setIsEnabled(placement.isEnabled !== undefined ? placement.isEnabled : true);
      setPosition(placement.position !== undefined ? String(placement.position) : '');
      setIsResponsive(placement.responsive !== undefined ? placement.responsive : true);
      setCustomCode(placement.customCode || '');
    } else {
      setName('');
      setSlot('');
      setType('between-posts');
      setFormat('auto');
      setLocation('all-pages');
      setIsEnabled(true);
      setPosition('');
      setIsResponsive(true);
      setCustomCode('');
    }
  }, [placement, open]);
  
  // Mutations for creating and updating ad placements
  const createMutation = useMutation({
    mutationFn: (newPlacement: Omit<AdPlacement, 'id' | 'createdAt' | 'updatedAt'>) => {
      return adPlacementsApi.create(newPlacement);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adPlacements'] });
      toast({
        title: 'Success',
        description: 'Ad placement created successfully',
      });
      onSave();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create ad placement',
        variant: 'destructive',
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<AdPlacement> }) => {
      return adPlacementsApi.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adPlacements'] });
      toast({
        title: 'Success',
        description: 'Ad placement updated successfully',
      });
      onSave();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update ad placement',
        variant: 'destructive',
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !slot || !type || !format || !location) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    const placementData = {
      name,
      slot,
      type,
      format,
      location,
      isEnabled,
      position: position ? parseInt(position, 10) : undefined,
      responsive: isResponsive,
      customCode: customCode || undefined,
    };
    
    if (placement?.id) {
      updateMutation.mutate({ id: placement.id, data: placementData });
    } else {
      createMutation.mutate(placementData as any);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{placement ? 'Edit Ad Placement' : 'Create New Ad Placement'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ad name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slot">AdSense Slot ID *</Label>
              <Input
                id="slot"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                placeholder="e.g., 1234567890"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Ad Type *</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select ad type" />
                </SelectTrigger>
                <SelectContent>
                  {AD_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="format">Ad Format *</Label>
              <Select value={format} onValueChange={setFormat} required>
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select ad format" />
                </SelectTrigger>
                <SelectContent>
                  {AD_FORMATS.map(format => (
                    <SelectItem key={format.value} value={format.value}>{format.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Display Location *</Label>
              <Select value={location} onValueChange={setLocation} required>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map(loc => (
                    <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {(type === 'in-content' || type === 'between-posts') && (
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Position (e.g., after paragraph 3)"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="responsive"
                checked={isResponsive}
                onCheckedChange={setIsResponsive}
              />
              <Label htmlFor="responsive">Responsive Ad</Label>
            </div>
          </div>
          
          {type === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customCode">Custom Ad Code</Label>
              <Textarea
                id="customCode"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="Paste custom ad code here"
                rows={4}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
              />
              <Label htmlFor="enabled">Enabled</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {placement ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdPlacementDialog;
