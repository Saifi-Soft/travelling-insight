
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

const AdvancedThemeSettings = () => {
  const { lightThemeColors, darkThemeColors } = useTheme();
  const [customCss, setCustomCss] = useState('');
  const [fontFamily, setFontFamily] = useState('Open Sans');
  const [headerFont, setHeaderFont] = useState('Poppins');
  const [borderRadius, setBorderRadius] = useState('0.5rem');
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  
  const generateCssVariables = () => {
    const lightTheme = Object.entries(lightThemeColors)
      .map(([key, value]) => `  --light-${key}: ${value};`)
      .join('\n');
      
    const darkTheme = Object.entries(darkThemeColors)
      .map(([key, value]) => `  --dark-${key}: ${value};`)
      .join('\n');
      
    return `:root {\n${lightTheme}\n}\n\n.dark {\n${darkTheme}\n}`;
  };
  
  const handleSaveAdvanced = () => {
    toast.success('Advanced theme settings saved');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Appearance Settings</CardTitle>
        <CardDescription>
          Fine-tune advanced visual settings for your website.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="font-family">Primary Font Family</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger id="font-family" className="w-full">
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="header-font">Header Font Family</Label>
              <Select value={headerFont} onValueChange={setHeaderFont}>
                <SelectTrigger id="header-font" className="w-full">
                  <SelectValue placeholder="Select header font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                  <SelectItem value="Merriweather">Merriweather</SelectItem>
                  <SelectItem value="Raleway">Raleway</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="border-radius">Border Radius</Label>
              <Select value={borderRadius} onValueChange={setBorderRadius}>
                <SelectTrigger id="border-radius" className="w-full">
                  <SelectValue placeholder="Select border radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None (0)</SelectItem>
                  <SelectItem value="0.25rem">Small (0.25rem)</SelectItem>
                  <SelectItem value="0.5rem">Medium (0.5rem)</SelectItem>
                  <SelectItem value="0.75rem">Large (0.75rem)</SelectItem>
                  <SelectItem value="1rem">Extra Large (1rem)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="animation-speed">Animation Speed</Label>
              <Select value={animationSpeed} onValueChange={setAnimationSpeed}>
                <SelectTrigger id="animation-speed" className="w-full">
                  <SelectValue placeholder="Select animation speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="css-vars">CSS Variables</Label>
              <Textarea 
                id="css-vars" 
                value={generateCssVariables()} 
                readOnly 
                className="font-mono h-[200px] resize-none bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="custom-css">Custom CSS</Label>
              <Textarea 
                id="custom-css" 
                value={customCss} 
                onChange={(e) => setCustomCss(e.target.value)} 
                placeholder="Add your custom CSS here..."
                className="font-mono h-[150px]"
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Import/Export Settings</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">Export Theme JSON</Button>
            <div className="flex items-center gap-2">
              <Input type="file" id="import-theme" className="w-auto" accept=".json" />
              <Button variant="outline">Import Theme</Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveAdvanced}>Save Advanced Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedThemeSettings;
