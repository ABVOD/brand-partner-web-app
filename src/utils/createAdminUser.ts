import type { UserProfile, UserRole } from '../contexts/AuthContext';

// Utility functions for local storage (duplicated from AuthContext for independence)
const USERS_KEY = 'dummy_users_data';

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
  return [];
}

function saveUsers(users: UserProfile[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateUID(): string {
  return 'user-' + Math.random().toString(36).substr(2, 9);
}

// This is a utility function for creating admin users
// In a real app, this would be done through a secure admin interface
export async function createAdminUser(email: string, role: UserRole = 'admin') {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getStoredUsers();
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const uid = generateUID();

    // Create the user profile with admin role
    const userProfile: UserProfile = {
      uid,
      email,
      role,
      displayName: email.split('@')[0],
      createdAt: new Date(),
      isActive: true,
      lastLogin: new Date()
    };

    // Save to local storage
    users.push(userProfile);
    saveUsers(users);

    console.log(`Successfully created ${role} user:`, email);
    console.log('You can now login with this email and any password');
    return userProfile;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Helper function to call from browser console for testing
(window as any).createAdminUser = createAdminUser; 