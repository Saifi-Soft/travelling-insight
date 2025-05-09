import React, { useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

// Create a context for tab selection
export const AppearanceTabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>({
  activeTab: 'presets',
  setActiveTab: () => {},
});

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  lightTheme: {
    background: string;
    foreground: string;
    primary: string;
    footer: string;
    header: string;
    card: string;
    text: string;
    link: string;
    button: string;
    accent: string;
  };
  darkTheme: {
    background: string;
    foreground: string;
    primary: string;
    footer: string;
    header: string;
    card: string;
    text: string;
    link: string;
    button: string;
    accent: string;
  };
}

const themePresets: ThemePreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Default green theme with light and dark variants',
    lightTheme: {
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
    },
    darkTheme: {
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
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Calming blue tones inspired by the sea',
    lightTheme: {
      background: '#ffffff',
      foreground: '#333333',
      primary: '#0EA5E9',
      footer: '#0c4a6e',
      header: '#f0f9ff',
      card: '#f0f9ff',
      text: '#333333',
      link: '#0EA5E9',
      button: '#0EA5E9',
      accent: '#38bdf8',
    },
    darkTheme: {
      background: '#0f172a',
      foreground: '#e2e8f0',
      primary: '#38bdf8',
      footer: '#1e3a5f',
      header: '#1e3a5f',
      card: '#1e293b',
      text: '#e2e8f0',
      link: '#38bdf8',
      button: '#38bdf8',
      accent: '#6366f1',
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    description: 'Warm orange and amber tones',
    lightTheme: {
      background: '#ffffff',
      foreground: '#422006',
      primary: '#ea580c',
      footer: '#9a3412',
      header: '#fff7ed',
      card: '#ffedd5',
      text: '#422006',
      link: '#ea580c',
      button: '#ea580c',
      accent: '#f97316',
    },
    darkTheme: {
      background: '#27272a',
      foreground: '#fafafa',
      primary: '#f97316',
      footer: '#7c2d12',
      header: '#7c2d12',
      card: '#3f3f46',
      text: '#fafafa',
      link: '#f97316',
      button: '#f97316',
      accent: '#7c2d12',
    }
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    description: 'Soft purple tones for a calm experience',
    lightTheme: {
      background: '#ffffff',
      foreground: '#3b0764',
      primary: '#9333ea',
      footer: '#7e22ce',
      header: '#faf5ff',
      card: '#f3e8ff',
      text: '#3b0764',
      link: '#9333ea',
      button: '#9333ea',
      accent: '#a855f7',
    },
    darkTheme: {
      background: '#1c1033',
      foreground: '#e9d5ff',
      primary: '#a855f7',
      footer: '#6b21a8',
      header: '#6b21a8',
      card: '#3b0764',
      text: '#e9d5ff',
      link: '#a855f7',
      button: '#a855f7',
      accent: '#3b0764',
    }
  },
  {
    id: 'forest',
    name: 'Forest Green',
    description: 'Deep greens inspired by dense forests',
    lightTheme: {
      background: '#ffffff',
      foreground: '#14532d',
      primary: '#16a34a',
      footer: '#15803d',
      header: '#f0fdf4',
      card: '#dcfce7',
      text: '#14532d',
      link: '#16a34a',
      button: '#16a34a',
      accent: '#22c55e',
    },
    darkTheme: {
      background: '#0f1f0f',
      foreground: '#dcfce7',
      primary: '#22c55e',
      footer: '#166534',
      header: '#166534',
      card: '#14532d',
      text: '#dcfce7',
      link: '#22c55e',
      button: '#22c55e',
      accent: '#14532d',
    }
  },
  {
    id: 'cherry',
    name: 'Cherry Blossom',
    description: 'Delicate pink theme inspired by cherry blossoms',
    lightTheme: {
      background: '#ffffff',
      foreground: '#881337',
      primary: '#e11d48',
      footer: '#be123c',
      header: '#fff1f2',
      card: '#ffe4e6',
      text: '#881337',
      link: '#e11d48',
      button: '#e11d48',
      accent: '#f43f5e',
    },
    darkTheme: {
      background: '#1c1033',
      foreground: '#fecdd3',
      primary: '#f43f5e',
      footer: '#9f1239',
      header: '#9f1239',
      card: '#881337',
      text: '#fecdd3',
      link: '#f43f5e',
      button: '#f43f5e',
      accent: '#881337',
    }
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark blue and purple tones for a night sky feel',
    lightTheme: {
      background: '#ffffff',
      foreground: '#1e1b4b',
      primary: '#4338ca',
      footer: '#3730a3',
      header: '#eef2ff',
      card: '#e0e7ff',
      text: '#1e1b4b',
      link: '#4338ca',
      button: '#4338ca',
      accent: '#6366f1',
    },
    darkTheme: {
      background: '#0f172a',
      foreground: '#e0e7ff',
      primary: '#6366f1',
      footer: '#312e81',
      header: '#312e81',
      card: '#1e1b4b',
      text: '#e0e7ff',
      link: '#6366f1',
      button: '#6366f1',
      accent: '#1e1b4b',
    }
  },
  {
    id: 'coffee',
    name: 'Coffee',
    description: 'Warm browns inspired by coffee tones',
    lightTheme: {
      background: '#ffffff',
      foreground: '#44403c',
      primary: '#92400e',
      footer: '#78350f',
      header: '#fef3c7',
      card: '#fef3c7',
      text: '#44403c',
      link: '#92400e',
      button: '#92400e',
      accent: '#d97706',
    },
    darkTheme: {
      background: '#1c1917',
      foreground: '#e7e5e4',
      primary: '#d97706',
      footer: '#78350f',
      header: '#78350f',
      card: '#44403c',
      text: '#e7e5e4',
      link: '#d97706',
      button: '#d97706',
      accent: '#44403c',
    }
  },
  {
    id: 'slate',
    name: 'Modern Slate',
    description: 'Professional gray tones for a modern look',
    lightTheme: {
      background: '#f8fafc',
      foreground: '#334155',
      primary: '#64748b',
      footer: '#475569',
      header: '#f1f5f9',
      card: '#f1f5f9',
      text: '#334155',
      link: '#64748b',
      button: '#64748b',
      accent: '#94a3b8',
    },
    darkTheme: {
      background: '#0f172a',
      foreground: '#e2e8f0',
      primary: '#94a3b8',
      footer: '#334155',
      header: '#334155',
      card: '#1e293b',
      text: '#e2e8f0',
      link: '#94a3b8',
      button: '#94a3b8',
      accent: '#334155',
    }
  },
  {
    id: 'neon',
    name: 'Neon Future',
    description: 'Bold neon colors for a futuristic look',
    lightTheme: {
      background: '#ffffff',
      foreground: '#18181b',
      primary: '#3b82f6',
      footer: '#1d4ed8',
      header: '#eff6ff',
      card: '#dbeafe',
      text: '#18181b',
      link: '#3b82f6',
      button: '#3b82f6',
      accent: '#8b5cf6',
    },
    darkTheme: {
      background: '#09090b',
      foreground: '#e4e4e7',
      primary: '#8b5cf6',
      footer: '#4c1d95',
      header: '#4c1d95',
      card: '#18181b',
      text: '#e4e4e7',
      link: '#8b5cf6',
      button: '#8b5cf6',
      accent: '#18181b',
    }
  }
];

const PresetThemes = () => {
  const { setTheme, updateThemeColor, saveThemeChanges } = useTheme();
  const { setActiveTab } = useContext(AppearanceTabsContext);
  
  const chooseTheme = (preset: ThemePreset) => {
    // Save light theme colors as a batch
    const lightThemeChanges = {...preset.lightTheme};
    const darkThemeChanges = {...preset.darkTheme};
    
    // Apply the theme changes as a batch instead of individually
    saveThemeChanges('light', lightThemeChanges, darkThemeChanges);
    
    toast.success(`Selected "${preset.name}" theme`);
    
    // Navigate to the customize tab
    setActiveTab('customize');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Presets</CardTitle>
        <CardDescription>
          Choose from a selection of pre-designed themes for your website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themePresets.map((preset) => (
            <div key={preset.id} className="border rounded-lg overflow-hidden">
              <div className="flex h-24">
                <div className="w-1/2 p-3" style={{ backgroundColor: preset.lightTheme.background, color: preset.lightTheme.text || preset.lightTheme.foreground }}>
                  <div className="h-6 mb-2" style={{ backgroundColor: preset.lightTheme.header }}></div>
                  <div className="h-4 w-1/2 mb-1" style={{ backgroundColor: preset.lightTheme.card }}></div>
                  <div className="h-3 w-full" style={{ backgroundColor: preset.lightTheme.primary }}></div>
                </div>
                <div className="w-1/2 p-3" style={{ backgroundColor: preset.darkTheme.background, color: preset.darkTheme.text || preset.darkTheme.foreground }}>
                  <div className="h-6 mb-2" style={{ backgroundColor: preset.darkTheme.header }}></div>
                  <div className="h-4 w-1/2 mb-1" style={{ backgroundColor: preset.darkTheme.card }}></div>
                  <div className="h-3 w-full" style={{ backgroundColor: preset.darkTheme.primary }}></div>
                </div>
              </div>
              <div className="p-4 border-t">
                <h3 className="font-medium">{preset.name}</h3>
                <p className="text-sm text-muted-foreground">{preset.description}</p>
                <Button 
                  onClick={() => chooseTheme(preset)} 
                  className="w-full mt-2"
                  variant="outline"
                >
                  Choose Theme
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PresetThemes;
