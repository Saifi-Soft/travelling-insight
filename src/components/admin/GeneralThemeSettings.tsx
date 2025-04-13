
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

const GeneralThemeSettings = () => {
  const { theme, setTheme } = useTheme();
  
  const handleSave = () => {
    toast.success("General theme settings saved");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Appearance Settings</CardTitle>
        <CardDescription>
          Configure the basic appearance settings for your website.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Theme Mode</h3>
            <RadioGroup 
              defaultValue={theme} 
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

          <Separator />

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Layout Options</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduced-motion">Reduce animations</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations for improved accessibility
                </p>
              </div>
              <Switch id="reduced-motion" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">High contrast mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enhance visual contrast for better readability
                </p>
              </div>
              <Switch id="high-contrast" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="large-text">Larger text</Label>
                <p className="text-sm text-muted-foreground">
                  Increase the default text size
                </p>
              </div>
              <Switch id="large-text" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralThemeSettings;
