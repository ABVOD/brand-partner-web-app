import { useState } from 'react';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import UserCrudManager, { type User } from '../../components/UserCrudManager';

export default function UserCrudDemo() {
  // State to manage users - in a real app, this would come from a backend API
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      phone: '+1234567890',
      role: 'brand_partner',
      status: 'active',
      isVerified: true,
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20 14:30',
      location: 'New York, NY',
      totalIncidents: 0,
      totalCheckIns: 45,
      safeIdShares: 12,
      dateOfBirth: '1990-05-15',
      address: '123 Main St, New York, NY 10001',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+1234567891',
        relationship: 'Spouse'
      }
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      phone: '+1234567892',
      role: 'user',
      status: 'active',
      isVerified: true,
      joinDate: '2024-01-10',
      lastLogin: '2024-01-20 16:45',
      location: 'Los Angeles, CA',
      totalIncidents: 2,
      totalCheckIns: 78,
      safeIdShares: 28,
      dateOfBirth: '1988-08-20',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      emergencyContact: {
        name: 'John Smith',
        phone: '+1234567893',
        relationship: 'Brother'
      }
    },
    {
      id: '3',
      email: 'mike.johnson@example.com',
      name: 'Mike Johnson',
      phone: '+1234567894',
      role: 'user',
      status: 'pending_verification',
      isVerified: false,
      joinDate: '2024-01-18',
      lastLogin: '2024-01-19 10:15',
      location: 'Chicago, IL',
      totalIncidents: 0,
      totalCheckIns: 3,
      safeIdShares: 1,
      dateOfBirth: '1992-12-03',
      address: '789 Elm St, Chicago, IL 60601',
      emergencyContact: {
        name: 'Sarah Johnson',
        phone: '+1234567895',
        relationship: 'Sister'
      }
    }
  ]);

  // Simulate API call for creating a user
  const handleUserCreate = async (userData: Partial<User>): Promise<void> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: 'Never',
        isVerified: false,
        totalIncidents: 0,
        totalCheckIns: 0,
        safeIdShares: 0,
        ...userData
      } as User;
      
      setUsers(prev => [...prev, newUser]);
      
      // You could show a success toast here
      console.log('User created successfully:', newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw to let the component handle the error
    }
  };

  // Simulate API call for updating a user
  const handleUserUpdate = async (id: string, userData: Partial<User>): Promise<void> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, ...userData } : user
      ));
      
      // You could show a success toast here
      console.log('User updated successfully:', id, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error; // Re-throw to let the component handle the error
    }
  };

  // Simulate API call for deleting a user
  const handleUserDelete = async (id: string): Promise<void> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.filter(user => user.id !== id));
      
      // You could show a success toast here
      console.log('User deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error; // Re-throw to let the component handle the error
    }
  };

  // Handle export functionality
  const handleUserExport = () => {
    const csvData = [
      // CSV headers
      ['Name', 'Email', 'Phone', 'Role', 'Status', 'Join Date', 'Location', 'Check-ins', 'Incidents'],
      // CSV data rows
      ...users.map(user => [
        user.name,
        user.email,
        user.phone || '',
        user.role,
        user.status,
        user.joinDate,
        user.location,
        user.totalCheckIns.toString(),
        user.totalIncidents.toString()
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900">Advanced User Management</h1>
            <p className="mt-2 text-gray-600">
              This is an enhanced user management system with full CRUD (Create, Read, Update, Delete) operations. 
              You can create new users, view detailed user information, edit existing users, and delete users as needed.
            </p>
            
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900">Features included:</h3>
              <ul className="mt-2 text-sm text-blue-800 list-disc list-inside space-y-1">
                <li>Create new users with comprehensive information</li>
                <li>View detailed user profiles including activity statistics</li>
                <li>Edit user information and status</li>
                <li>Delete users with confirmation</li>
                <li>Search and filter users by name, email, status, and role</li>
                <li>Export user data to CSV</li>
                <li>Form validation and error handling</li>
                <li>Emergency contact management</li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Management Component */}
        <UserCrudManager
          users={users}
          onUserCreate={handleUserCreate}
          onUserUpdate={handleUserUpdate}
          onUserDelete={handleUserDelete}
          onUserExport={handleUserExport}
        />
      </div>
    </AdminDashboardLayout>
  );
} 