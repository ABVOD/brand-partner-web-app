import { useState, useMemo } from 'react';
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
  CheckBadgeIcon,
  ArrowDownTrayIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

interface User {
  id: string;
  email: string;
  name: string;
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
  activityLog?: {
    action: string;
    timestamp: string;
    details: string;
  }[];
}

type SortField = 'name' | 'joinDate' | 'lastLogin' | 'totalCheckIns';
type SortDirection = 'asc' | 'desc';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('joinDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showActivityLog, setShowActivityLog] = useState(false);

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowsUpDownIcon className="h-4 w-4" />;
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="h-4 w-4" /> : 
      <ChevronDownIcon className="h-4 w-4" />;
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      
      return matchesSearch && matchesStatus && matchesRole;
    });

    return filtered.sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'name':
          return direction * a.name.localeCompare(b.name);
        case 'joinDate':
          return direction * (new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime());
        case 'lastLogin':
          return direction * (new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime());
        case 'totalCheckIns':
          return direction * (a.totalCheckIns - b.totalCheckIns);
        default:
          return 0;
      }
    });
  }, [users, searchTerm, filterStatus, filterRole, sortField, sortDirection]);

  const handleBulkAction = (action: 'verify' | 'block' | 'unblock' | 'delete') => {
    // In a real app, this would make an API call for each selected user
    console.log(`Bulk action ${action} for users:`, Array.from(selectedUsers));
    setSelectedUsers(new Set());
  };

  const exportUserData = () => {
    const data = filteredAndSortedUsers.map(user => ({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      joinDate: user.joinDate,
      lastLogin: user.lastLogin,
      location: user.location,
      totalCheckIns: user.totalCheckIns,
      totalIncidents: user.totalIncidents,
      safeIdShares: user.safeIdShares
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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
            <button
              onClick={exportUserData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </button>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{filteredAndSortedUsers.length}</span>
                <span className="text-sm text-gray-500">users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.size > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {selectedUsers.size} users selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('verify')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <ShieldCheckIcon className="h-4 w-4 mr-1" />
                  Verify
                </button>
                <button
                  onClick={() => handleBulkAction('block')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <NoSymbolIcon className="h-4 w-4 mr-1" />
                  Block
                </button>
                <button
                  onClick={() => handleBulkAction('unblock')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <CheckBadgeIcon className="h-4 w-4 mr-1" />
                  Unblock
                </button>
              </div>
            </div>
          </div>
        )}

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
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      checked={selectedUsers.size === filteredAndSortedUsers.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(new Set(filteredAndSortedUsers.map(u => u.id)));
                        } else {
                          setSelectedUsers(new Set());
                        }
                      }}
                    />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>User</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('totalCheckIns')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Activity</span>
                      {getSortIcon('totalCheckIns')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lastLogin')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Last Login</span>
                      {getSortIcon('lastLogin')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        checked={selectedUsers.has(user.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedUsers);
                          if (e.target.checked) {
                            newSelected.add(user.id);
                          } else {
                            newSelected.delete(user.id);
                          }
                          setSelectedUsers(newSelected);
                        }}
                      />
                    </td>
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
                          : user.role === 'admin' 
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'brand_partner' ? 'Brand Partner' : user.role === 'admin' ? 'Admin' : 'App User'}
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
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Activity Statistics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedUser.totalCheckIns}</div>
                      <div className="text-sm text-gray-500">Check-ins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedUser.totalIncidents}</div>
                      <div className="text-sm text-gray-500">Incidents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedUser.safeIdShares}</div>
                      <div className="text-sm text-gray-500">Safe ID Shares</div>
                    </div>
                  </div>
                </div>

                {/* Activity Log */}
                <div>
                  <button
                    onClick={() => setShowActivityLog(!showActivityLog)}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Activity Log
                    {showActivityLog ? (
                      <ChevronUpIcon className="h-4 w-4 ml-1" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </button>
                  
                  {showActivityLog && (
                    <div className="mt-3 space-y-2">
                      {selectedUser.activityLog?.map((log, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          <span className="font-medium">{log.action}</span> - {log.timestamp}
                          <p className="text-gray-500">{log.details}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
} 