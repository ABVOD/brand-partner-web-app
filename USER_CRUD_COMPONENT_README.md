# User CRUD Management Component

A comprehensive React component for managing users with full CRUD (Create, Read, Update, Delete) operations, built with TypeScript and Tailwind CSS.

## Overview

The `UserCrudManager` component provides a complete user management interface with the following capabilities:

- **Create** new users with detailed information
- **Read** and view user profiles with activity statistics
- **Update** user information and status
- **Delete** users with confirmation dialog
- **Search and Filter** users by name, email, status, and role
- **Export** user data to CSV format
- **Form Validation** with error handling
- **Emergency Contact** management

## Features

### 🚀 Core CRUD Operations
- ✅ Create new users with comprehensive form
- ✅ View detailed user information in modal
- ✅ Edit existing user information
- ✅ Delete users with confirmation dialog

### 🔍 Search & Filter
- ✅ Real-time search by name or email
- ✅ Filter by user status (Active, Blocked, Pending Verification)
- ✅ Filter by user role (App User, Brand Partner, Admin)

### 📊 User Information Management
- ✅ Basic info (name, email, phone, location)
- ✅ Role and status management
- ✅ Address and date of birth
- ✅ Emergency contact information
- ✅ Activity statistics (check-ins, incidents, safe ID shares)

### 🛠 Additional Features
- ✅ CSV export functionality
- ✅ Form validation and error handling
- ✅ Loading states and async operation support
- ✅ Responsive design with mobile support
- ✅ Accessible UI components

## Installation and Setup

### 1. Component Files

The component consists of two main files:

```
src/
├── components/
│   └── UserCrudManager.tsx          # Main CRUD component
└── pages/
    └── admin/
        └── UserCrudDemo.tsx         # Demo/example usage
```

### 2. Dependencies

Make sure you have the following dependencies installed (already included in your project):

```json
{
  "@heroicons/react": "^2.2.0",
  "react": "^19.1.0",
  "tailwindcss": "^4.1.8"
}
```

## Usage

### Basic Usage

```tsx
import UserCrudManager from '../components/UserCrudManager';

function MyUserManagementPage() {
  return (
    <div>
      <UserCrudManager />
    </div>
  );
}
```

### Advanced Usage with API Integration

```tsx
import { useState } from 'react';
import UserCrudManager, { type User } from '../components/UserCrudManager';

function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);

  const handleUserCreate = async (userData: Partial<User>) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (response.ok) {
      const newUser = await response.json();
      setUsers(prev => [...prev, newUser]);
    }
  };

  const handleUserUpdate = async (id: string, userData: Partial<User>) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (response.ok) {
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, ...userData } : user
      ));
    }
  };

  const handleUserDelete = async (id: string) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  return (
    <UserCrudManager
      users={users}
      onUserCreate={handleUserCreate}
      onUserUpdate={handleUserUpdate}
      onUserDelete={handleUserDelete}
      onUserExport={() => {
        // Custom export logic
      }}
    />
  );
}
```

## Props API

### UserCrudManagerProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `users` | `User[]` | No | Array of users to display. If not provided, uses mock data |
| `onUserCreate` | `(user: Partial<User>) => Promise<void>` | No | Callback function when a user is created |
| `onUserUpdate` | `(id: string, user: Partial<User>) => Promise<void>` | No | Callback function when a user is updated |
| `onUserDelete` | `(id: string) => Promise<void>` | No | Callback function when a user is deleted |
| `onUserExport` | `() => void` | No | Callback function for custom export functionality |
| `className` | `string` | No | Additional CSS classes to apply to the component |

### User Interface

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'brand_partner' | 'user' | 'admin';
  status: 'active' | 'blocked' | 'pending_verification';
  isVerified: boolean;
  joinDate: string;
  lastLogin: string;
  location: string;
  totalIncidents: number;
  totalCheckIns: number;
  safeIdShares: number;
  avatar?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}
```

## Examples

### 1. Standalone Component

```tsx
// Simple usage with built-in mock data
<UserCrudManager />
```

### 2. With Custom Styling

```tsx
<UserCrudManager 
  className="my-custom-class"
  users={myUsers}
/>
```

### 3. Integrated with Admin Dashboard

```tsx
import AdminDashboardLayout from '../components/AdminDashboardLayout';
import UserCrudManager from '../components/UserCrudManager';

function AdminUserManagement() {
  return (
    <AdminDashboardLayout>
      <UserCrudManager
        users={users}
        onUserCreate={handleCreate}
        onUserUpdate={handleUpdate}
        onUserDelete={handleDelete}
      />
    </AdminDashboardLayout>
  );
}
```

## Component Structure

### Main Features

1. **Header Section**
   - Title and description
   - Export button (if onUserExport provided)
   - Add User button
   - User count display

2. **Filters Section**
   - Search input (by name or email)
   - Status filter dropdown
   - Role filter dropdown

3. **Users Table**
   - User information display
   - Action buttons (View, Edit, Delete)
   - Responsive design with horizontal scroll

4. **Modal System**
   - Create/Edit form modal
   - View user details modal
   - Delete confirmation modal

### Form Validation

The component includes comprehensive form validation:

- **Required fields**: Name, Email, Phone, Location
- **Email format validation**
- **Duplicate email prevention**
- **Real-time error display**

### Responsive Design

- Mobile-friendly responsive layout
- Horizontal scroll for table on small screens
- Responsive modal sizing
- Touch-friendly action buttons

## Customization

### Styling

The component uses Tailwind CSS classes and can be customized by:

1. **Adding custom CSS classes** via the `className` prop
2. **Overriding Tailwind classes** in your CSS
3. **Modifying the component** for specific design requirements

### Functionality

You can extend the component by:

1. **Adding new fields** to the User interface and form
2. **Implementing custom validation** rules
3. **Adding bulk operations** for multiple users
4. **Integrating with your authentication** system

## Integration with Your Backend

### API Integration Pattern

```typescript
// Example service layer
class UserService {
  static async createUser(userData: Partial<User>): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  static async deleteUser(id: string): Promise<void> {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
  }
}

// Usage in component
const handleUserCreate = async (userData: Partial<User>) => {
  try {
    const newUser = await UserService.createUser(userData);
    setUsers(prev => [...prev, newUser]);
    // Show success message
  } catch (error) {
    // Handle error
    console.error('Failed to create user:', error);
  }
};
```

## Demo Page

A complete demo is available at `src/pages/admin/UserCrudDemo.tsx` which shows:

- Full integration with AdminDashboardLayout
- Simulated API calls with loading states
- Error handling examples
- CSV export functionality
- State management patterns

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for tablets and mobile devices

## Contributing

When extending this component:

1. Follow TypeScript best practices
2. Maintain accessibility standards
3. Keep responsive design principles
4. Add proper error handling
5. Write descriptive comments for complex logic

## Troubleshooting

### Common Issues

1. **Import errors**: Make sure to use type-only imports for interfaces
   ```tsx
   import UserCrudManager, { type User } from './UserCrudManager';
   ```

2. **Styling issues**: Ensure Tailwind CSS is properly configured
3. **Form validation**: Check that required fields are properly validated
4. **Modal issues**: Ensure proper z-index for modal overlays

### Performance Considerations

- The component uses `useMemo` for filtered results
- Large user lists (1000+) should implement pagination
- Consider virtualization for very large datasets
- API calls should include proper loading states

---

For questions or issues, please refer to the component source code or create an issue in the project repository. 