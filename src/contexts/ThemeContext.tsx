
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
  primary: '#065f46', // custom-green
  footer: '#065f46', // custom-green
  header: '#ffffff',
  card: '#f8f9fa',
};

const defaultDarkColors: ThemeColors = {
  background: '#1f2937',
  foreground: '#f8f9fa',
  primary: '#065f46', // custom-green
  footer: '#065f46', // custom-green
  header: '#111827',
  card: '#374151',
};

// Create a context with a default undefined value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state for both light and dark theme colors
  const [theme, setThemeState] = useState<Theme>('light');
  const [lightThemeColors, setLightThemeColors] = useState<ThemeColors>(defaultLightColors);
  const [darkThemeColors, setDarkThemeColors] = useState<ThemeColors>(defaultDarkColors);
  const [themeColors, setThemeColors] = useState<ThemeColors>(defaultLightColors);

  // Load saved theme and colors from localStorage after component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    // Load saved theme colors from localStorage
    const savedLightColors = localStorage.getItem('lightThemeColors');
    const savedDarkColors = localStorage.getItem('darkThemeColors');
    
    // Set light theme colors
    if (savedLightColors) {
      try {
        const parsedLightColors = JSON.parse(savedLightColors);
        setLightThemeColors(parsedLightColors);
      } catch (e) {
        console.error("Error parsing light theme colors:", e);
        setLightThemeColors(defaultLightColors);
      }
    }
    
    // Set dark theme colors
    if (savedDarkColors) {
      try {
        const parsedDarkColors = JSON.parse(savedDarkColors);
        setDarkThemeColors(parsedDarkColors);
      } catch (e) {
        console.error("Error parsing dark theme colors:", e);
        setDarkThemeColors(defaultDarkColors);
      }
    }
    
    // Set theme and corresponding colors
    if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'system') {
      setThemeState(savedTheme);
      
      if (savedTheme === 'dark' || 
          (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setThemeColors(savedDarkColors ? JSON.parse(savedDarkColors) : defaultDarkColors);
      } else {
        setThemeColors(savedLightColors ? JSON.parse(savedLightColors) : defaultLightColors);
      }
    } else {
      // Check system preference if no saved theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light');
      setThemeColors(prefersDark ? darkThemeColors : lightThemeColors);
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    // Update localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('lightThemeColors', JSON.stringify(lightThemeColors));
    localStorage.setItem('darkThemeColors', JSON.stringify(darkThemeColors));
    
    // Determine if dark mode should be applied
    const isDark = 
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Apply theme class and set active theme colors
    if (isDark) {
      document.documentElement.classList.add('dark');
      setThemeColors(darkThemeColors);
    } else {
      document.documentElement.classList.remove('dark');
      setThemeColors(lightThemeColors);
    }
    
    // Apply CSS variables for theme colors
    Object.entries(themeColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
    
  }, [theme, lightThemeColors, darkThemeColors, themeColors]);

  // Update when system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setThemeColors(mediaQuery.matches ? darkThemeColors : lightThemeColors);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, darkThemeColors, lightThemeColors]);

  // Toggle through themes: light -> dark -> system -> light
  const toggleTheme = () => {
    setThemeState(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };

  // Set theme directly
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
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
        document.documentElement.style.setProperty(`--color-${colorType}`, value);
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
        document.documentElement.style.setProperty(`--color-${colorType}`, value);
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
