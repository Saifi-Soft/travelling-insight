
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getThemeSettings, saveThemeSettings } from '@/api/themeService';
import { useSession } from '@/hooks/useSession';

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
  background: '#1A1F2C',  // Dark purple for dark mode
  foreground: '#f8f9fa',  // Light text for dark mode
  primary: '#10B981',     // Emerald green for primary actions in dark mode
  footer: '#222222',      // Dark footer
  header: '#222222',      // Dark header
  card: '#2D3748',        // Dark card background
};

// Create a context with a default undefined value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state for both light and dark theme colors
  const [theme, setThemeState] = useState<Theme>('light');
  const [lightThemeColors, setLightThemeColors] = useState<ThemeColors>(defaultLightColors);
  const [darkThemeColors, setDarkThemeColors] = useState<ThemeColors>(defaultDarkColors);
  const [themeColors, setThemeColors] = useState<ThemeColors>(defaultLightColors);
  const { session } = useSession();
  
  // Load theme settings from MongoDB
  useEffect(() => {
    const loadThemeFromDb = async () => {
      if (session?.user?.id) {
        try {
          const savedTheme = await getThemeSettings(session.user.id);
          
          if (savedTheme) {
            // Set theme mode
            if (savedTheme.theme) {
              setThemeState(savedTheme.theme as Theme);
            }
            
            // Set light theme colors if available
            if (savedTheme.lightThemeColors) {
              setLightThemeColors(savedTheme.lightThemeColors);
            }
            
            // Set dark theme colors if available
            if (savedTheme.darkThemeColors) {
              setDarkThemeColors(savedTheme.darkThemeColors);
            }
            
            // Set active colors based on current theme
            const isDark = 
              savedTheme.theme === 'dark' || 
              (savedTheme.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            
            setThemeColors(isDark ? 
              (savedTheme.darkThemeColors || defaultDarkColors) : 
              (savedTheme.lightThemeColors || defaultLightColors)
            );
          }
        } catch (error) {
          console.error('Error loading theme from database:', error);
          // Fall back to localStorage if database fetch fails
          loadFromLocalStorage();
        }
      } else {
        // If no user session, fall back to localStorage
        loadFromLocalStorage();
      }
    };
    
    loadThemeFromDb();
  }, [session?.user?.id]);

  // Fallback function to load from localStorage
  const loadFromLocalStorage = () => {
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
        const parsedDarkColors = savedDarkColors ? JSON.parse(savedDarkColors) : defaultDarkColors;
        setThemeColors(parsedDarkColors);
      } else {
        const parsedLightColors = savedLightColors ? JSON.parse(savedLightColors) : defaultLightColors;
        setThemeColors(parsedLightColors);
      }
    } else {
      // Check system preference if no saved theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light');
      setThemeColors(prefersDark ? darkThemeColors : lightThemeColors);
    }
  };

  // Save theme settings to MongoDB and localStorage
  const saveThemeSettings = async (
    newTheme: Theme = theme, 
    newLightColors: ThemeColors = lightThemeColors, 
    newDarkColors: ThemeColors = darkThemeColors
  ) => {
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('lightThemeColors', JSON.stringify(newLightColors));
    localStorage.setItem('darkThemeColors', JSON.stringify(newDarkColors));
    
    // Save to MongoDB if user is logged in
    if (session?.user?.id) {
      try {
        await saveThemeSettings(session.user.id, {
          theme: newTheme,
          lightThemeColors: newLightColors,
          darkThemeColors: newDarkColors
        });
      } catch (error) {
        console.error('Error saving theme to database:', error);
      }
    }
  };

  // Apply theme changes
  useEffect(() => {
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
    
    // Save settings
    saveThemeSettings();
    
  }, [theme, lightThemeColors, darkThemeColors, themeColors, session?.user?.id]);

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
      const newTheme = prevTheme === 'light' ? 'dark' : prevTheme === 'dark' ? 'system' : 'light';
      return newTheme;
    });
  };

  // Set theme directly
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Update theme color for specific mode (light/dark)
  const updateThemeColor = (colorType: keyof ThemeColors, value: string, mode: 'light' | 'dark') => {
    if (mode === 'light') {
      // For light mode, don't enforce custom-green for primary and footer anymore
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
      // For dark mode, allow any color
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
    
    // Save updated theme settings
    const updatedThemeSettings = {
      theme,
      lightThemeColors: mode === 'light' ? {
        ...lightThemeColors,
        [colorType]: value
      } : lightThemeColors,
      darkThemeColors: mode === 'dark' ? {
        ...darkThemeColors,
        [colorType]: value
      } : darkThemeColors
    };
    
    saveThemeSettings(theme, 
      updatedThemeSettings.lightThemeColors, 
      updatedThemeSettings.darkThemeColors
    );
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
