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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
            <CheckBadgeIcon className="h-3 w-3 mr-1" />
            Active
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300">
            <NoSymbolIcon className="h-3 w-3 mr-1" />
            Blocked
          </span>
        );
      case 'pending_verification':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300">
            <ShieldCheckIcon className="h-3 w-3 mr-1" />
            Admin
          </span>
        );
      case 'brand_partner':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
            Brand Partner
          </span>
        );
      case 'user':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600/50 text-gray-300">
            <UserIcon className="h-3 w-3 mr-1" />
            User
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">User Management</h1>
            <p className="text-gray-400 mt-1">Manage users, roles, and permissions</p>
          </div>
          <button
            onClick={exportUserData}
            className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="pending_verification">Pending</option>
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="brand_partner">Brand Partner</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.size > 0 && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">
                {selectedUsers.size} user{selectedUsers.size === 1 ? '' : 's'} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('verify')}
                  className="px-3 py-1 text-xs font-medium text-green-300 bg-green-900/50 rounded-full hover:bg-green-800/50"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleBulkAction('block')}
                  className="px-3 py-1 text-xs font-medium text-red-300 bg-red-900/50 rounded-full hover:bg-red-800/50"
                >
                  Block
                </button>
                <button
                  onClick={() => handleBulkAction('unblock')}
                  className="px-3 py-1 text-xs font-medium text-blue-300 bg-blue-900/50 rounded-full hover:bg-blue-800/50"
                >
                  Unblock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(new Set(filteredAndSortedUsers.map(u => u.id)));
                        } else {
                          setSelectedUsers(new Set());
                        }
                      }}
                      className="h-4 w-4 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>User</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role & Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-gray-100"
                    onClick={() => handleSort('joinDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Joined</span>
                      {getSortIcon('joinDate')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-gray-100"
                    onClick={() => handleSort('lastLogin')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Last Login</span>
                      {getSortIcon('lastLogin')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-gray-100"
                    onClick={() => handleSort('totalCheckIns')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Activity</span>
                      {getSortIcon('totalCheckIns')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
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
                        className="h-4 w-4 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPinIcon className="h-3 w-3 mr-1" />
                            {user.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                        {user.isVerified && (
                          <div className="flex items-center text-xs text-green-400">
                            <CheckBadgeIcon className="h-3 w-3 mr-1" />
                            Verified
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        <div className="text-gray-300">{user.totalCheckIns} check-ins</div>
                        <div className="text-gray-400">{user.totalIncidents} incidents</div>
                        <div className="text-gray-400">{user.safeIdShares} ID shares</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {user.status === 'pending_verification' && (
                          <button
                            onClick={() => handleUserAction(user.id, 'verify')}
                            className="text-green-400 hover:text-green-300"
                          >
                            <CheckBadgeIcon className="h-4 w-4" />
                          </button>
                        )}
                        {user.status === 'active' && (
                          <button
                            onClick={() => handleUserAction(user.id, 'block')}
                            className="text-red-400 hover:text-red-300"
                          >
                            <NoSymbolIcon className="h-4 w-4" />
                          </button>
                        )}
                        {user.status === 'blocked' && (
                          <button
                            onClick={() => handleUserAction(user.id, 'unblock')}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <ShieldCheckIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredAndSortedUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-100">No users found</h3>
            <p className="mt-1 text-sm text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUserModal(false)}></div>
              <div className="relative w-full max-w-2xl mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-medium text-gray-100">User Details</h3>
                  </div>
                  <div className="px-6 py-4 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-xl font-medium text-white">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-100">{selectedUser.name}</h4>
                        <p className="text-gray-400">{selectedUser.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          {getRoleBadge(selectedUser.role)}
                          {getStatusBadge(selectedUser.status)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-300">Location</h5>
                        <p className="text-gray-100">{selectedUser.location}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-300">Joined</h5>
                        <p className="text-gray-100">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-300">Last Login</h5>
                        <p className="text-gray-100">{selectedUser.lastLogin}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-300">Verification Status</h5>
                        <p className="text-gray-100">{selectedUser.isVerified ? 'Verified' : 'Not Verified'}</p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-2">Activity Summary</h5>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-gray-100">{selectedUser.totalCheckIns}</div>
                          <div className="text-xs text-gray-400">Check-ins</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-gray-100">{selectedUser.totalIncidents}</div>
                          <div className="text-xs text-gray-400">Incidents</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-gray-100">{selectedUser.safeIdShares}</div>
                          <div className="text-xs text-gray-400">ID Shares</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">
                      Edit User
                    </button>
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