import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string; // e.g. '😎', '⚡', '🎧', '💎', '🚀'
  role: string;
  budget: number;
  status: 'VIP RAVE PASS' | 'COMMUNITY' | 'PRO CREATOR';
  joinedAt: string;
  rememberMe?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    name: string;
    email: string;
    password?: string;
    budget?: number;
    avatar?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  quickVipLogin: (preset?: 'demo' | 'guest' | 'cyber') => void;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AUTH_STORAGE_KEY = 'mintmate_auth_session_v1';
const USERS_STORAGE_KEY = 'mintmate_registered_users_v1';

export const DEFAULT_VIP_USER: AuthUser = {
  id: 'usr-mint-01',
  name: 'mint_user',
  email: 'mint_user@mintmate.app',
  avatar: '😎',
  role: 'VIP Money Master',
  budget: 10000,
  status: 'VIP RAVE PASS',
  joinedAt: 'Day 1 of 30',
  rememberMe: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(DEFAULT_VIP_USER);
  const [isLoading, setIsLoading] = useState(false);

  // Load active session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          // If legacy old session or missing name, default to mint_user
          if (!parsed.name || parsed.id?.includes('vip') || parsed.name === 'Alex Morgan' || parsed.name.toLowerCase().includes('aathithyan')) {
            const normalized = { ...DEFAULT_VIP_USER, ...parsed, name: parsed.name && !parsed.name.toLowerCase().includes('aathithyan') && parsed.name !== 'Alex Morgan' ? parsed.name : 'mint_user' };
            setUser(normalized);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalized));
          } else {
            setUser({ ...DEFAULT_VIP_USER, ...parsed });
          }
        } else {
          setUser(DEFAULT_VIP_USER);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_VIP_USER));
        }
      } else {
        setUser(DEFAULT_VIP_USER);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_VIP_USER));
      }
    } catch (err) {
      console.error('Failed to load auth session:', err);
      setUser(DEFAULT_VIP_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (userData: AuthUser) => {
    setUser(userData);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to persist auth session', e);
    }
  };

  const login = async (
    email: string,
    password?: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    // Artificial small delay for EDM cyber feel
    await new Promise((res) => setTimeout(res, 400));

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email or username' };
    }

    if (password !== undefined && password.length > 0 && password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' };
    }

    // Check registered accounts in storage
    let storedUsers: AuthUser[] = [];
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY);
      if (existing) storedUsers = JSON.parse(existing);
    } catch {
      // ignore
    }

    const matched = storedUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    let authUser: AuthUser;
    if (matched) {
      authUser = { ...matched, rememberMe };
    } else if (cleanEmail === DEFAULT_VIP_USER.email.toLowerCase() || cleanEmail === 'vip' || cleanEmail === 'mint_user' || cleanEmail === 'demo') {
      authUser = { ...DEFAULT_VIP_USER, rememberMe };
    } else {
      // Create new session with customized display name from email
      const displayName = cleanEmail.split('@')[0];
      const capitalized = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      authUser = {
        id: `usr-${Date.now()}`,
        name: capitalized,
        email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@mintmate.club`,
        avatar: '⚡',
        role: 'Rave Member',
        budget: 10000,
        status: 'VIP RAVE PASS',
        joinedAt: 'Just now',
        rememberMe,
      };
    }

    saveSession(authUser);
    return { success: true };
  };

  const signup = async (data: {
    name: string;
    email: string;
    password?: string;
    budget?: number;
    avatar?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    await new Promise((res) => setTimeout(res, 450));

    const cleanName = data.name.trim();
    const cleanEmail = data.email.trim().toLowerCase();

    if (!cleanName) {
      return { success: false, error: 'Please provide your name or DJ handle' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please provide a valid email address' };
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      avatar: data.avatar || '🎧',
      role: 'VIP Rave Pass',
      budget: data.budget && data.budget >= 1000 ? Math.round(data.budget) : 10000,
      status: 'VIP RAVE PASS',
      joinedAt: 'Joined today',
      rememberMe: true,
    };

    // Store in registered users list
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY);
      const list: AuthUser[] = existing ? JSON.parse(existing) : [];
      list.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }

    saveSession(newUser);
    return { success: true };
  };

  const quickVipLogin = (preset: 'demo' | 'guest' | 'cyber' = 'demo') => {
    let presetUser: AuthUser;
    if (preset === 'guest') {
      presetUser = {
        id: 'usr-guest-vip',
        name: 'Guest Raver',
        email: 'guest@mintmate.app',
        avatar: '⚡',
        role: 'Guest Explorer',
        budget: 10000,
        status: 'VIP RAVE PASS',
        joinedAt: 'Instant Guest Pass',
      };
    } else if (preset === 'cyber') {
      presetUser = {
        id: 'usr-dj-cyber',
        name: 'DJ Neon Pulse',
        email: 'dj_cyber@mintmate.club',
        avatar: '🎧',
        role: 'EDM Sound Lead',
        budget: 15000,
        status: 'PRO CREATOR',
        joinedAt: 'VIP Headliner',
      };
    } else {
      presetUser = { ...DEFAULT_VIP_USER };
    }

    saveSession(presetUser);
  };

  const logout = () => {
    setUser(DEFAULT_VIP_USER);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEFAULT_VIP_USER));
    } catch (e) {
      console.error('Failed to reset auth session', e);
    }
  };

  const updateProfile = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    saveSession(updated);
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((res) => setTimeout(res, 600));
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please provide a valid registered email address.' };
    }
    return {
      success: true,
      message: `Cyber reset link dispatched to ${email}. You can sign in using instant access pass.`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        quickVipLogin,
        logout,
        updateProfile,
        requestPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
