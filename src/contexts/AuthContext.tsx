import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type UserRole = 'brand_partner' | 'admin' | 'super_admin' | 'accident_user';

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt: Date;
  isActive: boolean;
  lastLogin?: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signup: (email: string, password: string, role?: UserRole) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  updateUserRole: (uid: string, role: UserRole) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Dummy data storage
const STORAGE_KEY = 'dummy_auth_data';
const USERS_KEY = 'dummy_users_data';

// Pre-defined dummy users
const defaultUsers: UserProfile[] = [
  // Admin Users
  {
    uid: 'admin-1',
    email: 'admin@example.com',
    role: 'admin',
    displayName: 'Admin User',
    createdAt: new Date('2024-01-01'),
    isActive: true,
    lastLogin: new Date()
  },
  {
    uid: 'super-admin-1',
    email: 'superadmin@example.com',
    role: 'super_admin',
    displayName: 'Super Admin',
    createdAt: new Date('2024-01-01'),
    isActive: true,
    lastLogin: new Date()
  },
  
  // Brand Partners
  {
    uid: 'brand-partner-1',
    email: 'partner@example.com',
    role: 'brand_partner',
    displayName: 'Brand Partner',
    createdAt: new Date('2024-01-01'),
    isActive: true,
    lastLogin: new Date()
  },
  {
    uid: 'brand-partner-2',
    email: 'starbucks@demo.com',
    role: 'brand_partner',
    displayName: 'Starbucks Manager',
    createdAt: new Date('2024-01-15'),
    isActive: true,
    lastLogin: new Date()
  },
  {
    uid: 'brand-partner-3',
    email: 'mcdonalds@demo.com',
    role: 'brand_partner',
    displayName: 'McDonald\'s Marketing',
    createdAt: new Date('2024-01-20'),
    isActive: true,
    lastLogin: new Date()
  },
  {
    uid: 'brand-partner-4',
    email: 'subway@demo.com',
    role: 'brand_partner',
    displayName: 'Subway Franchise',
    createdAt: new Date('2024-02-01'),
    isActive: true,
    lastLogin: new Date()
  },

  // Accident Users
  {
    uid: 'accident-user-1',
    email: 'alice.driver@example.com',
    role: 'accident_user',
    displayName: 'Alice Driver',
    createdAt: new Date('2024-01-10'),
    isActive: true,
    lastLogin: new Date()
  },
  {
    uid: 'accident-user-2',
    email: 'bob.commuter@example.com',
    role: 'accident_user',
    displayName: 'Bob Commuter',
    createdAt: new Date('2024-01-18'),
    isActive: true,
    lastLogin: new Date()
  },
  {
    uid: 'accident-user-3',
    email: 'carol.cyclist@example.com',
    role: 'accident_user',
    displayName: 'Carol Cyclist',
    createdAt: new Date('2024-02-03'),
    isActive: true,
    lastLogin: new Date()
  },

  // Easy to remember test accounts
  {
    uid: 'test-1',
    email: 'test@test.com',
    role: 'brand_partner',
    displayName: 'Test User',
    createdAt: new Date('2024-01-01'),
    isActive: true,
    lastLogin: new Date()
  },
  {
    uid: 'demo-1',
    email: 'demo@demo.com',
    role: 'brand_partner',
    displayName: 'Demo User',
    createdAt: new Date('2024-01-01'),
    isActive: true,
    lastLogin: new Date()
  },
  {
    uid: 'user-1',
    email: 'user@user.com',
    role: 'brand_partner',
    displayName: 'Regular User',
    createdAt: new Date('2024-01-01'),
    isActive: true,
    lastLogin: new Date()
  },

  // Realistic business accounts
  {
    uid: 'business-1',
    email: 'marketing@pizzahut.com',
    role: 'brand_partner',
    displayName: 'Pizza Hut Marketing',
    createdAt: new Date('2024-01-10'),
    isActive: true,
    lastLogin: new Date()
  },
  {
    uid: 'business-2',
    email: 'promo@bestbuy.com',
    role: 'brand_partner',
    displayName: 'Best Buy Promotions',
    createdAt: new Date('2024-01-25'),
    isActive: true,
    lastLogin: new Date()
  },
  {
    uid: 'business-3',
    email: 'offers@target.com',
    role: 'brand_partner',
    displayName: 'Target Offers Team',
    createdAt: new Date('2024-02-05'),
    isActive: true,
    lastLogin: new Date()
  }
];

// Utility functions for local storage
function getStoredUsers(): UserProfile[] {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    const users = JSON.parse(stored);
    return users.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
    }));
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function saveUsers(users: UserProfile[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateUID(): string {
  return 'user-' + Math.random().toString(36).substr(2, 9);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, role: UserRole = 'brand_partner') {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getStoredUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const uid = generateUID();
    const user: User = {
      uid,
      email,
      displayName: email.split('@')[0]
    };

    const userProfileData: UserProfile = {
      uid,
      email,
      role,
      displayName: user.displayName || undefined,
      createdAt: new Date(),
      isActive: true,
      lastLogin: new Date()
    };

    // Save user to storage
    users.push(userProfileData);
    saveUsers(users);

    // Set current user
    setCurrentUser(user);
    setUserProfile(userProfileData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ uid, email }));

    return { user };
  }

  async function login(email: string, password: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getStoredUsers();
    const userProfileData = users.find(u => u.email === email);
    
    if (!userProfileData) {
      throw new Error('User not found');
    }

    // Simple password check - in dummy mode, any password works for existing users
    if (!password) {
      throw new Error('Password required');
    }

    const user: User = {
      uid: userProfileData.uid,
      email: userProfileData.email,
      displayName: userProfileData.displayName
    };

    // Update last login
    userProfileData.lastLogin = new Date();
    saveUsers(users);

    setCurrentUser(user);
    setUserProfile(userProfileData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ uid: user.uid, email: user.email }));

    return { user };
  }

  async function logout() {
    setCurrentUser(null);
    setUserProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  async function updateUserRole(uid: string, role: UserRole) {
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.uid === uid);
    
    if (userIndex !== -1) {
      users[userIndex].role = role;
      saveUsers(users);
      
      // Update local state if it's the current user
      if (userProfile && userProfile.uid === uid) {
        setUserProfile({ ...userProfile, role });
      }
    }
  }

  useEffect(() => {
    // Check for stored authentication
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (storedAuth) {
      const { uid, email } = JSON.parse(storedAuth);
      const users = getStoredUsers();
      const userProfileData = users.find(u => u.uid === uid);
      
      if (userProfileData) {
        const user: User = {
          uid,
          email,
          displayName: userProfileData.displayName
        };
        
        setCurrentUser(user);
        setUserProfile(userProfileData);
      }
    }
    
    setLoading(false);
  }, []);

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin';
  const isSuperAdmin = userProfile?.role === 'super_admin';

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    isSuperAdmin,
    signup,
    login,
    logout,
    updateUserRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 