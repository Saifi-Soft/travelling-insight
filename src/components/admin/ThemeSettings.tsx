
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

type ThemeColorKey = 'background' | 'foreground' | 'primary' | 'footer' | 'header' | 'card' | 'text' | 'link' | 'button' | 'accent';

const ThemeSettings = () => {
  const { 
    theme, 
    lightThemeColors, 
    darkThemeColors,
    updateThemeColor,
    saveThemeChanges
  } = useTheme();
  
  const [lightColors, setLightColors] = useState({ ...lightThemeColors });
  const [darkColors, setDarkColors] = useState({ ...darkThemeColors });
  const [currentModeTab, setCurrentModeTab] = useState('light');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLightColors({ ...lightThemeColors });
    setDarkColors({ ...darkThemeColors });
    setHasChanges(false);
  }, [lightThemeColors, darkThemeColors]);

  const handleLightColorChange = (colorType: ThemeColorKey, value: string) => {
    setLightColors(prev => ({
      ...prev,
      [colorType]: value
    }));
    setHasChanges(true);
  };

  const handleDarkColorChange = (colorType: ThemeColorKey, value: string) => {
    setDarkColors(prev => ({
      ...prev,
      [colorType]: value
    }));
    setHasChanges(true);
  };

  const applyLightThemeChanges = () => {
    // Apply all light theme changes at once
    saveThemeChanges('light', lightColors, darkThemeColors);
    setHasChanges(false);
    toast.success('Light theme colors updated');
  };

  const applyDarkThemeChanges = () => {
    // Apply all dark theme changes at once
    saveThemeChanges('dark', lightThemeColors, darkColors);
    setHasChanges(false);
    toast.success('Dark theme colors updated');
  };

  const resetToDefaults = (mode: 'light' | 'dark') => {
    if (mode === 'light') {
      const defaultLightColors = {
        background: '#ffffff',
        foreground: '#222222',
        primary: '#065f46',
        footer: '#065f46',
        header: '#ffffff',
        card: '#f8f9fa',
        text: '#333333',
        link: '#065f46',
        button: '#065f46',
        accent: '#10B981',
      };
      
      setLightColors(defaultLightColors);
      setHasChanges(true);
    } else {
      const defaultDarkColors = {
        background: '#1A1F2C',
        foreground: '#f8f9fa',
        primary: '#10B981',
        footer: '#222222',
        header: '#222222',
        card: '#2D3748',
        text: '#f8f9fa',
        link: '#10B981',
        button: '#10B981',
        accent: '#8B5CF6',
      };
      
      setDarkColors(defaultDarkColors);
      setHasChanges(true);
    }
  };

  const colorLabels = {
    background: 'Background Color',
    foreground: 'Foreground Color',
    primary: 'Primary Color',
    footer: 'Footer Color',
    header: 'Header Color',
    card: 'Card Color',
    text: 'Text Color',
    link: 'Link Color',
    button: 'Button Color',
    accent: 'Accent Color',
  };

  const renderColorFields = (colors: typeof lightColors, handleChange: (key: ThemeColorKey, value: string) => void, mode: 'light' | 'dark') => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(colors).map(([key, value]) => (
          <div key={`${mode}-${key}`} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${mode}-${key}`}>{colorLabels[key as keyof typeof colorLabels] || key}</Label>
              <div 
                className="w-6 h-6 rounded border shadow-sm" 
                style={{ backgroundColor: value }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Input
                id={`${mode}-${key}`}
                type="text"
                value={value}
                onChange={(e) => handleChange(key as ThemeColorKey, e.target.value)}
              />
              <Input
                type="color"
                value={value}
                className="w-12 h-10 p-1 cursor-pointer"
                onChange={(e) => handleChange(key as ThemeColorKey, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button 
          variant="outline" 
          onClick={() => resetToDefaults(mode)}
        >
          Reset to Defaults
        </Button>
        <Button 
          onClick={mode === 'light' ? applyLightThemeChanges : applyDarkThemeChanges}
          disabled={!hasChanges}
        >
          Apply Changes
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Customize Theme Colors</CardTitle>
        <CardDescription>
          Modify theme colors for light and dark modes separately.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentModeTab} onValueChange={setCurrentModeTab}>
          <TabsList className="mb-6 w-full grid grid-cols-2">
            <TabsTrigger value="light" className="flex-1">Light Mode</TabsTrigger>
            <TabsTrigger value="dark" className="flex-1">Dark Mode</TabsTrigger>
          </TabsList>
          
          {/* Preview section - moved above color selection fields */}
          <div className="space-y-6 mb-6">
            <h3 className="text-lg font-medium">Preview</h3>
            <p className="text-sm text-muted-foreground">
              This shows how your theme changes will appear on your website.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 rounded-lg overflow-hidden border">
              <div className="p-4">
                <h4 className="font-medium mb-2">Light Mode</h4>
                <div className="p-4 rounded-lg border" style={{backgroundColor: lightColors.background, color: lightColors.text || lightColors.foreground}}>
                  <div className="p-2 mb-2 rounded" style={{backgroundColor: lightColors.header, color: lightColors.text || lightColors.foreground}}>
                    Header
                  </div>
                  <div className="p-2 mb-2 rounded" style={{backgroundColor: lightColors.card, color: lightColors.text || lightColors.foreground, border: `1px solid ${lightColors.primary}`}}>
                    Card with <span style={{color: lightColors.primary}}>Primary</span> color text and <a href="#" style={{color: lightColors.link || lightColors.primary}}>Link</a>
                    <div className="mt-2">
                      <button style={{backgroundColor: lightColors.button || lightColors.primary, color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '0.25rem'}}>
                        Button
                      </button>
                    </div>
                  </div>
                  <div className="p-2 rounded" style={{backgroundColor: lightColors.footer, color: "#fff"}}>
                    Footer
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="font-medium mb-2">Dark Mode</h4>
                <div className="p-4 rounded-lg border" style={{backgroundColor: darkColors.background, color: darkColors.text || darkColors.foreground}}>
                  <div className="p-2 mb-2 rounded" style={{backgroundColor: darkColors.header, color: darkColors.text || darkColors.foreground}}>
                    Header
                  </div>
                  <div className="p-2 mb-2 rounded" style={{backgroundColor: darkColors.card, color: darkColors.text || darkColors.foreground, border: `1px solid ${darkColors.primary}`}}>
                    Card with <span style={{color: darkColors.primary}}>Primary</span> color text and <a href="#" style={{color: darkColors.link || darkColors.primary}}>Link</a>
                    <div className="mt-2">
                      <button style={{backgroundColor: darkColors.button || darkColors.primary, color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '0.25rem'}}>
                        Button
                      </button>
                    </div>
                  </div>
                  <div className="p-2 rounded" style={{backgroundColor: darkColors.footer, color: "#fff"}}>
                    Footer
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <TabsContent value="light" className="focus:outline-none">
            {renderColorFields(lightColors, handleLightColorChange, 'light')}
          </TabsContent>
          
          <TabsContent value="dark" className="focus:outline-none">
            {renderColorFields(darkColors, handleDarkColorChange, 'dark')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;
