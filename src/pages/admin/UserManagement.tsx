import { useState } from 'react';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ClockIcon,
  MapPinIcon,
  DocumentTextIcon,
  UserIcon,
  NoSymbolIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'brand_partner' | 'user';
  status: 'active' | 'blocked' | 'pending_verification';
  isVerified: boolean;
  joinDate: string;
  lastLogin: string;
  location: string;
  totalIncidents: number;
  totalCheckIns: number;
  safeIdShares: number;
  avatar?: string;
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Mock data - in a real app, this would come from your backend
  const users: User[] = [
    {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: 'brand_partner',
      status: 'active',
      isVerified: true,
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20 14:30',
      location: 'New York, NY',
      totalIncidents: 0,
      totalCheckIns: 45,
      safeIdShares: 12
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      role: 'user',
      status: 'active',
      isVerified: true,
      joinDate: '2024-01-10',
      lastLogin: '2024-01-20 16:45',
      location: 'Los Angeles, CA',
      totalIncidents: 2,
      totalCheckIns: 78,
      safeIdShares: 28
    },
    {
      id: '3',
      email: 'mike.johnson@example.com',
      name: 'Mike Johnson',
      role: 'user',
      status: 'pending_verification',
      isVerified: false,
      joinDate: '2024-01-18',
      lastLogin: '2024-01-19 10:15',
      location: 'Chicago, IL',
      totalIncidents: 0,
      totalCheckIns: 3,
      safeIdShares: 1
    },
    {
      id: '4',
      email: 'sarah.wilson@example.com',
      name: 'Sarah Wilson',
      role: 'brand_partner',
      status: 'blocked',
      isVerified: true,
      joinDate: '2024-01-05',
      lastLogin: '2024-01-15 09:20',
      location: 'Houston, TX',
      totalIncidents: 1,
      totalCheckIns: 22,
      safeIdShares: 8
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleUserAction = (userId: string, action: 'verify' | 'block' | 'unblock') => {
    console.log(`Action ${action} for user ${userId}`);
    // In a real app, this would make an API call
  };

  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckBadgeIcon className="h-3 w-3 mr-1" />
            Active
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <NoSymbolIcon className="h-3 w-3 mr-1" />
            Blocked
          </span>
        );
      case 'pending_verification':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="mt-1 text-gray-600">View, verify, and manage user accounts</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{filteredUsers.length}</span>
                <span className="text-sm text-gray-500">users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="pending_verification">Pending Verification</option>
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Roles</option>
                <option value="user">App Users</option>
                <option value="brand_partner">Brand Partners</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            {user.isVerified && (
                              <ShieldCheckIcon className="h-4 w-4 text-green-500" title="Verified" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">{user.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'brand_partner' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'brand_partner' ? 'Brand Partner' : 'App User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-4 text-xs">
                          <span title="Check-ins">📍 {user.totalCheckIns}</span>
                          <span title="Incidents">⚠️ {user.totalIncidents}</span>
                          <span title="Safe ID Shares">🛡️ {user.safeIdShares}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openUserDetails(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {!user.isVerified && (
                          <button
                            onClick={() => handleUserAction(user.id, 'verify')}
                            className="text-green-600 hover:text-green-900"
                            title="Verify User"
                          >
                            <ShieldCheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction(user.id, 'block')}
                            className="text-red-600 hover:text-red-900"
                            title="Block User"
                          >
                            <NoSymbolIcon className="h-4 w-4" />
                          </button>
                        ) : user.status === 'blocked' ? (
                          <button
                            onClick={() => handleUserAction(user.id, 'unblock')}
                            className="text-green-600 hover:text-green-900"
                            title="Unblock User"
                          >
                            <CheckBadgeIcon className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Join Date</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.joinDate}</p>
                  </div>
                </div>

                {/* Activity Stats */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Activity Summary</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <MapPinIcon className="h-8 w-8 text-blue-600" />
                        <div className="ml-3">
                          <p className="text-2xl font-bold text-blue-900">{selectedUser.totalCheckIns}</p>
                          <p className="text-sm text-blue-600">Check-ins</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-8 w-8 text-orange-600" />
                        <div className="ml-3">
                          <p className="text-2xl font-bold text-orange-900">{selectedUser.totalIncidents}</p>
                          <p className="text-sm text-orange-600">Incidents</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <ShieldCheckIcon className="h-8 w-8 text-green-600" />
                        <div className="ml-3">
                          <p className="text-2xl font-bold text-green-900">{selectedUser.safeIdShares}</p>
                          <p className="text-sm text-green-600">Safe ID Shares</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Activities</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MapPinIcon className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-900">Check-in at Central Park</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-900">Safe ID shared with emergency contact</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
} 