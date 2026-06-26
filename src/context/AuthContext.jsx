import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('wf_token'));
  const [loading, setLoading] = useState(true);
  
  // Apple Logic: Default to the user's native system theme (Mac/iOS) if no manual preference is saved
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('wf_theme');
    if (savedTheme) return savedTheme;
    
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Fallback
  });

  // Apple Logic: Apply theme with canvas styling and system level transitions
  useEffect(() => {
    //console.log(API_BASE_URL);
    const root = document.documentElement;
    
    // Inject a temporary global transition style to make the theme shift fluid (macOS style fade)
    const disableTransitions = () => {
      const css = document.createElement('style');
      css.type = 'text/css';
      css.appendChild(
        document.createTextNode(
          `* { transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease !important; }`
        )
      );
      document.head.appendChild(css);
      return css;
    };

    const cssTransitionModifier = disableTransitions();

    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark'; // Optimizes native Apple scrollbars & form controls
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    localStorage.setItem('wf_theme', theme);

    // Clean up temporary transition override
    const timer = setTimeout(() => {
      if (cssTransitionModifier.parentNode) {
        document.head.removeChild(cssTransitionModifier);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [theme]);

  // Sync with OS settings changes automatically if the user changes theme via Mac Control Center
  useEffect(() => {
    if (localStorage.getItem('wf_theme')) return; // Don't override manual choice

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load current user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to load user session', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('wf_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    localStorage.setItem('wf_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const updateProfile = async (profileData) => {
    if (!token) return;
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    setUser(prev => ({
      ...prev,
      profile: data.profile
    }));
    return data.profile;
  };

  const logout = () => {
    localStorage.removeItem('wf_token');
    setToken(null);
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Helper fetch method with credentials
  const apiFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    if (response.status === 401) {
      logout();
      throw new Error('Session expired');
    }
    return response;
  };

  const value = {
    user,
    token,
    loading,
    theme,
    login,
    register,
    updateProfile,
    logout,
    toggleTheme,
    apiFetch
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};