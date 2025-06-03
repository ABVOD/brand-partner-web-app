import { useState } from 'react';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import UserCrudManager, { type User } from '../../components/UserCrudManager';

export default function UserCrudPage() {
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
      email: 'alice.driver@example.com',
      name: 'Alice Driver',
      phone: '+1234567894',
      role: 'accident_user',
      status: 'active',
      isVerified: true,
      joinDate: '2024-01-08',
      lastLogin: '2024-01-21 09:15',
      location: 'Chicago, IL',
      totalIncidents: 3,
      totalCheckIns: 0,
      safeIdShares: 15,
      dateOfBirth: '1985-03-12',
      address: '789 Oak St, Chicago, IL 60601',
      emergencyContact: {
        name: 'Bob Driver',
        phone: '+1234567895',
        relationship: 'Husband'
      },
      safeId: 'SF-4X8K-9M2L-R7B3',
      insuranceProviders: ['State Farm', 'Geico'],
      accidentHistory: [
        { id: 'acc1', date: '2024-01-20', type: 'Vehicle Collision', status: 'resolved' },
        { id: 'acc2', date: '2024-01-15', type: 'Minor Fender Bender', status: 'pending' },
        { id: 'acc3', date: '2023-12-10', type: 'Parking Incident', status: 'resolved' }
      ]
    },
    {
      id: '4',
      email: 'bob.commuter@example.com',
      name: 'Bob Commuter',
      phone: '+1234567896',
      role: 'accident_user',
      status: 'active',
      isVerified: true,
      joinDate: '2024-01-18',
      lastLogin: '2024-01-21 14:22',
      location: 'Houston, TX',
      totalIncidents: 1,
      totalCheckIns: 0,
      safeIdShares: 8,
      dateOfBirth: '1992-11-08',
      address: '321 Pine St, Houston, TX 77001',
      emergencyContact: {
        name: 'Carol Commuter',
        phone: '+1234567897',
        relationship: 'Sister'
      },
      safeId: 'SF-7N9P-3K5M-T2W6',
      insuranceProviders: ['Progressive'],
      accidentHistory: [
        { id: 'acc4', date: '2024-01-19', type: 'Bicycle Accident', status: 'investigating' }
      ]
    },
    {
      id: '5',
      email: 'mike.johnson@example.com',
      name: 'Mike Johnson',
      phone: '+1234567898',
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
        phone: '+1234567899',
        relationship: 'Sister'
      }
    },
    {
      id: '6',
      email: 'sarah.wilson@example.com',
      name: 'Sarah Wilson',
      phone: '+1234567900',
      role: 'brand_partner',
      status: 'blocked',
      isVerified: true,
      joinDate: '2024-01-05',
      lastLogin: '2024-01-15 09:20',
      location: 'Houston, TX',
      totalIncidents: 1,
      totalCheckIns: 22,
      safeIdShares: 8,
      dateOfBirth: '1985-03-10',
      address: '321 Pine St, Houston, TX 77001',
      emergencyContact: {
        name: 'David Wilson',
        phone: '+1234567901',
        relationship: 'Husband'
      }
    },
    {
      id: '7',
      email: 'alex.chen@example.com',
      name: 'Alex Chen',
      phone: '+1234567902',
      role: 'admin',
      status: 'active',
      isVerified: true,
      joinDate: '2023-12-01',
      lastLogin: '2024-01-21 11:00',
      location: 'San Francisco, CA',
      totalIncidents: 0,
      totalCheckIns: 120,
      safeIdShares: 45,
      dateOfBirth: '1987-11-22',
      address: '567 Market St, San Francisco, CA 94102',
      emergencyContact: {
        name: 'Lisa Chen',
        phone: '+1234567903',
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
      <UserCrudManager
        users={users}
        onUserCreate={handleUserCreate}
        onUserUpdate={handleUserUpdate}
        onUserDelete={handleUserDelete}
        onUserExport={handleUserExport}
      />
    </AdminDashboardLayout>
  );
} 