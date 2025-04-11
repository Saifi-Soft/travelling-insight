
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  footer: string;
  header: string;
  card: string;
}

interface ThemeContextType {
  theme: Theme;
  themeColors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  updateThemeColor: (colorType: keyof ThemeColors, value: string) => void;
}

const defaultLightColors: ThemeColors = {
  background: '#ffffff',
  foreground: '#222222',
  primary: '#3b82f6', // blue-500
  footer: '#3b82f6', // blue-500
  header: '#ffffff',
  card: '#f8f9fa',
};

const defaultDarkColors: ThemeColors = {
  background: '#1f2937',
  foreground: '#f8f9fa',
  primary: '#3b82f6', // blue-500
  footer: '#1e3a8a', // blue-900
  header: '#111827',
  card: '#374151',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Get initial theme and colors from localStorage or use defaults
  const [theme, setTheme] = useState<Theme>('light');
  const [themeColors, setThemeColors] = useState<ThemeColors>(defaultLightColors);

  // Initialize theme after component mounts (when window is available)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'system') {
      setTheme(savedTheme);
      
      // Set initial colors based on theme
      if (savedTheme === 'dark') {
        const savedColors = localStorage.getItem('darkThemeColors');
        setThemeColors(savedColors ? JSON.parse(savedColors) : defaultDarkColors);
      } else {
        const savedColors = localStorage.getItem('lightThemeColors');
        setThemeColors(savedColors ? JSON.parse(savedColors) : defaultLightColors);
      }
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      setThemeColors(prefersDark ? defaultDarkColors : defaultLightColors);
    }
  }, []);

  // Update localStorage and document class when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Apply theme class to document
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      
      // Save colors for dark theme
      localStorage.setItem('darkThemeColors', JSON.stringify(themeColors));
    } else {
      document.documentElement.classList.remove('dark');
      
      // Save colors for light theme
      localStorage.setItem('lightThemeColors', JSON.stringify(themeColors));
    }
    
    // Apply CSS variables for theme colors
    document.documentElement.style.setProperty('--color-background', themeColors.background);
    document.documentElement.style.setProperty('--color-foreground', themeColors.foreground);
    document.documentElement.style.setProperty('--color-primary', themeColors.primary);
    document.documentElement.style.setProperty('--color-footer', themeColors.footer);
    document.documentElement.style.setProperty('--color-header', themeColors.header);
    document.documentElement.style.setProperty('--color-card', themeColors.card);
  }, [theme, themeColors]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        if (e.matches) {
          setThemeColors(defaultDarkColors);
        } else {
          setThemeColors(defaultLightColors);
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };

  const updateThemeColor = (colorType: keyof ThemeColors, value: string) => {
    setThemeColors(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeColors, 
      toggleTheme, 
      setTheme, 
      updateThemeColor 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
