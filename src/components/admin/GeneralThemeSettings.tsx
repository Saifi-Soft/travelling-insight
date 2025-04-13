
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { mongoApiService } from '@/api/mongoApiService';
import { useSession } from '@/hooks/useSession';

const GeneralThemeSettings = () => {
  const { theme, setTheme } = useTheme();
  const { session } = useSession();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadSettings = async () => {
      if (session?.user?.id) {
        try {
          const settings = await mongoApiService.queryDocuments('accessibilitySettings', { userId: session.user.id });
          if (settings.length > 0) {
            setReducedMotion(settings[0].reducedMotion || false);
            setHighContrast(settings[0].highContrast || false);
            setLargeText(settings[0].largeText || false);
          }
        } catch (error) {
          console.error('Error loading accessibility settings:', error);
        }
      }
      setLoading(false);
    };
    
    loadSettings();
  }, [session?.user?.id]);

  const handleSave = async () => {
    try {
      if (session?.user?.id) {
        const settings = await mongoApiService.queryDocuments('accessibilitySettings', { userId: session.user.id });
        
        if (settings.length > 0) {
          await mongoApiService.updateDocument(
            'accessibilitySettings',
            settings[0].id,
            { 
              reducedMotion,
              highContrast,
              largeText,
              updatedAt: new Date().toISOString() 
            }
          );
        } else {
          await mongoApiService.insertDocument(
            'accessibilitySettings', 
            {
              userId: session.user.id,
              reducedMotion,
              highContrast,
              largeText,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          );
        }
        
        // Apply settings to the document
        document.documentElement.classList.toggle('reduced-motion', reducedMotion);
        document.documentElement.classList.toggle('high-contrast', highContrast);
        document.documentElement.classList.toggle('large-text', largeText);
        
        toast.success("General theme settings saved");
      } else {
        toast.error("You must be logged in to save settings");
      }
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
      toast.error("Failed to save settings");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            Loading settings...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Appearance Settings</CardTitle>
        <CardDescription>
          Configure the basic appearance settings for your website.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Theme Mode</h3>
              <RadioGroup 
                value={theme} 
                onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light">Light Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark">Dark Mode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="theme-system" />
                  <Label htmlFor="theme-system">System Default</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Layout Preview</h3>
            <div className="border rounded-md p-4 bg-card text-card-foreground h-[200px] flex flex-col">
              <div className="bg-primary text-primary-foreground p-2 rounded-t-sm mb-2">
                Header area
              </div>
              <div className="flex-1 p-2 border rounded-sm mb-2 text-sm">
                <p>Content with current theme settings</p>
                <p className="text-muted-foreground mt-1">Muted text appears like this</p>
                <button className="mt-2 bg-primary text-primary-foreground px-2 py-1 rounded-sm text-xs">
                  Button example
                </button>
              </div>
              <div className="bg-muted p-2 rounded-b-sm text-sm">
                Footer area
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Accessibility Options</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion">Reduce animations</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations for improved accessibility
              </p>
            </div>
            <Switch 
              id="reduced-motion" 
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast">High contrast mode</Label>
              <p className="text-sm text-muted-foreground">
                Enhance visual contrast for better readability
              </p>
            </div>
            <Switch 
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="large-text">Larger text</Label>
              <p className="text-sm text-muted-foreground">
                Increase the default text size
              </p>
            </div>
            <Switch 
              id="large-text"
              checked={largeText}
              onCheckedChange={setLargeText}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralThemeSettings;
