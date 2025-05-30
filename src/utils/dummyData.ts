/**
 * Dummy Data Management Utility
 * 
 * This file contains all dummy data for testing and development.
 * Use these credentials to login and test the application.
 */

import type { UserProfile, UserRole } from '../contexts/AuthContext';

// Test Credentials - Use any password with these emails
export const TEST_CREDENTIALS = {
  // Admin Accounts
  ADMIN: 'admin@example.com',
  SUPER_ADMIN: 'superadmin@example.com',
  
  // Easy to remember test accounts
  TEST: 'test@test.com',
  DEMO: 'demo@demo.com', 
  USER: 'user@user.com',
  
  // Brand partner accounts
  BRAND_PARTNER: 'partner@example.com',
  STARBUCKS: 'starbucks@demo.com',
  MCDONALDS: 'mcdonalds@demo.com',
  SUBWAY: 'subway@demo.com',
  
  // Business accounts
  PIZZA_HUT: 'marketing@pizzahut.com',
  BEST_BUY: 'promo@bestbuy.com',
  TARGET: 'offers@target.com'
} as const;

// Quick login helper - Add this to browser console
export const quickLogin = {
  admin: () => console.log('Login with: admin@example.com (any password)'),
  superAdmin: () => console.log('Login with: superadmin@example.com (any password)'),
  test: () => console.log('Login with: test@test.com (any password)'),
  demo: () => console.log('Login with: demo@demo.com (any password)'),
  starbucks: () => console.log('Login with: starbucks@demo.com (any password)'),
  mcdonalds: () => console.log('Login with: mcdonalds@demo.com (any password)'),
  all: () => {
    console.log('🔐 Available Test Accounts (use any password):');
    console.log('');
    console.log('👑 ADMIN ACCOUNTS:');
    console.log('  • admin@example.com (Admin)');
    console.log('  • superadmin@example.com (Super Admin)');
    console.log('');
    console.log('🏢 BRAND PARTNERS:');
    console.log('  • partner@example.com (Generic Partner)');
    console.log('  • starbucks@demo.com (Starbucks)');
    console.log('  • mcdonalds@demo.com (McDonald\'s)');
    console.log('  • subway@demo.com (Subway)');
    console.log('  • marketing@pizzahut.com (Pizza Hut)');
    console.log('  • promo@bestbuy.com (Best Buy)');
    console.log('  • offers@target.com (Target)');
    console.log('');
    console.log('🧪 TEST ACCOUNTS:');
    console.log('  • test@test.com (Test User)');
    console.log('  • demo@demo.com (Demo User)');
    console.log('  • user@user.com (Regular User)');
    console.log('');
    console.log('💡 Tip: You can use ANY password with these emails!');
  }
};

// Sample campaign data
export const SAMPLE_CAMPAIGNS = [
  {
    name: 'Summer Coffee Blast',
    location: { address: 'Downtown Seattle, WA', lat: 47.6062, lng: -122.3321, radius: 1000 },
    offerDetails: '50% off all iced coffee drinks',
    couponCode: 'SUMMER50',
    termsAndConditions: 'Valid until August 31st. One per customer.',
    brand: 'Starbucks'
  },
  {
    name: 'Big Mac Monday',
    location: { address: 'Times Square, New York, NY', lat: 40.7580, lng: -73.9855, radius: 500 },
    offerDetails: 'Buy one Big Mac, get one free',
    couponCode: 'BIGMAC2',
    termsAndConditions: 'Valid on Mondays only. Not combinable with other offers.',
    brand: 'McDonald\'s'
  },
  {
    name: 'Footlong Friday',
    location: { address: 'University Avenue, Berkeley, CA', lat: 37.8719, lng: -122.2585, radius: 750 },
    offerDetails: '$5 any footlong sandwich',
    couponCode: 'FRIDAY5',
    termsAndConditions: 'Valid on Fridays. Excludes premium subs.',
    brand: 'Subway'
  }
];

// Storage keys
export const STORAGE_KEYS = {
  AUTH_DATA: 'dummy_auth_data',
  USERS_DATA: 'dummy_users_data',
  CAMPAIGNS_DATA: 'dummy_campaigns_data'
} as const;

// Utility functions
export const dummyDataUtils = {
  /**
   * Clear all dummy data from localStorage
   */
  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('✅ All dummy data cleared!');
  },

  /**
   * Get current user count
   */
  getUserCount: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS_DATA);
    if (stored) {
      const users = JSON.parse(stored);
      return users.length;
    }
    return 0;
  },

  /**
   * List all registered users
   */
  listUsers: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS_DATA);
    if (stored) {
      const users = JSON.parse(stored);
      console.log('👥 Registered Users:');
      users.forEach((user: UserProfile) => {
        console.log(`  • ${user.email} (${user.role}) - ${user.displayName}`);
      });
    } else {
      console.log('No users found in storage');
    }
  },

  /**
   * Check if user exists
   */
  userExists: (email: string) => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS_DATA);
    if (stored) {
      const users = JSON.parse(stored);
      return users.some((user: UserProfile) => user.email === email);
    }
    return false;
  }
};

// Make utilities available in browser console
if (typeof window !== 'undefined') {
  (window as any).quickLogin = quickLogin;
  (window as any).dummyDataUtils = dummyDataUtils;
  (window as any).TEST_CREDENTIALS = TEST_CREDENTIALS;
  
  // Auto-log available credentials on page load
  setTimeout(() => {
    console.log('🚀 Dummy data loaded! Type "quickLogin.all()" to see all test accounts.');
  }, 1000);
} 