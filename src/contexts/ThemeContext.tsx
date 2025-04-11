
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
  lightThemeColors: ThemeColors;
  darkThemeColors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  updateThemeColor: (colorType: keyof ThemeColors, value: string, mode: 'light' | 'dark') => void;
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
  // Initialize state for both light and dark theme colors
  const [theme, setTheme] = useState<Theme>('light');
  const [lightThemeColors, setLightThemeColors] = useState<ThemeColors>(defaultLightColors);
  const [darkThemeColors, setDarkThemeColors] = useState<ThemeColors>(defaultDarkColors);
  const [themeColors, setThemeColors] = useState<ThemeColors>(defaultLightColors);

  // Initialize theme after component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    // Load saved theme colors from localStorage
    const savedLightColors = localStorage.getItem('lightThemeColors');
    const savedDarkColors = localStorage.getItem('darkThemeColors');
    
    // Set light theme colors
    if (savedLightColors) {
      setLightThemeColors(JSON.parse(savedLightColors));
    }
    
    // Set dark theme colors
    if (savedDarkColors) {
      setDarkThemeColors(JSON.parse(savedDarkColors));
    }
    
    // Set theme
    if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'system') {
      setTheme(savedTheme);
      
      // Set the active theme colors based on saved theme
      if (savedTheme === 'dark') {
        setThemeColors(savedDarkColors ? JSON.parse(savedDarkColors) : defaultDarkColors);
      } else {
        setThemeColors(savedLightColors ? JSON.parse(savedLightColors) : defaultLightColors);
      }
    } else {
      // Check system preference if no saved theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      setThemeColors(prefersDark ? darkThemeColors : lightThemeColors);
    }
  }, []);

  // Update localStorage and document class when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Save both theme color sets
    localStorage.setItem('lightThemeColors', JSON.stringify(lightThemeColors));
    localStorage.setItem('darkThemeColors', JSON.stringify(darkThemeColors));
    
    // Determine if dark mode should be applied
    const isDark = 
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Apply theme class
    if (isDark) {
      document.documentElement.classList.add('dark');
      setThemeColors(darkThemeColors);
    } else {
      document.documentElement.classList.remove('dark');
      setThemeColors(lightThemeColors);
    }
    
    // Apply CSS variables for theme colors
    document.documentElement.style.setProperty('--color-background', themeColors.background);
    document.documentElement.style.setProperty('--color-foreground', themeColors.foreground);
    document.documentElement.style.setProperty('--color-primary', themeColors.primary);
    document.documentElement.style.setProperty('--color-footer', themeColors.footer);
    document.documentElement.style.setProperty('--color-header', themeColors.header);
    document.documentElement.style.setProperty('--color-card', themeColors.card);
  }, [theme, lightThemeColors, darkThemeColors, themeColors]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setThemeColors(e.matches ? darkThemeColors : lightThemeColors);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, darkThemeColors, lightThemeColors]);

  // Toggle through themes: light -> dark -> system -> light
  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };

  // Update theme color for specific mode (light/dark)
  const updateThemeColor = (colorType: keyof ThemeColors, value: string, mode: 'light' | 'dark') => {
    if (mode === 'light') {
      setLightThemeColors(prev => ({
        ...prev,
        [colorType]: value
      }));
      
      // If currently in light mode, update active colors immediately
      if (theme === 'light' || (theme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setThemeColors(prev => ({
          ...prev,
          [colorType]: value
        }));
      }
    } else {
      setDarkThemeColors(prev => ({
        ...prev,
        [colorType]: value
      }));
      
      // If currently in dark mode, update active colors immediately
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setThemeColors(prev => ({
          ...prev,
          [colorType]: value
        }));
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeColors, 
      lightThemeColors,
      darkThemeColors,
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
