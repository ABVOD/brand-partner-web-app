import { useState, useMemo } from 'react';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShieldCheckIcon,
  NoSymbolIcon,
  XMarkIcon,
  CheckIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'brand_partner' | 'user' | 'admin' | 'accident_user';
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
  // New fields for accident users
  safeId?: string;
  insuranceProviders?: string[];
  accidentHistory?: {
    id: string;
    date: string;
    type: string;
    status: string;
  }[];
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: 'brand_partner' | 'user' | 'admin' | 'accident_user';
  status: 'active' | 'blocked' | 'pending_verification';
  location: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface UserCrudManagerProps {
  users?: User[];
  onUserCreate?: (user: Partial<User>) => Promise<void>;
  onUserUpdate?: (id: string, user: Partial<User>) => Promise<void>;
  onUserDelete?: (id: string) => Promise<void>;
  onUserExport?: () => void;
  className?: string;
}

export default function UserCrudManager({
  users: propUsers,
  onUserCreate,
  onUserUpdate,
  onUserDelete,
  onUserExport,
  className = ''
}: UserCrudManagerProps) {
  // Mock data if no users are provided
  const mockUsers: User[] = [
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
    }
  ];

  const users = propUsers || mockUsers;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('view');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    location: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, filterStatus, filterRole]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.location.trim()) errors.location = 'Location is required';

    // Check for duplicate email (only when creating or editing different user)
    const existingUser = users.find(u => u.email === formData.email);
    if (existingUser && (modalMode === 'create' || existingUser.id !== selectedUser?.id)) {
      errors.email = 'Email already exists';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active',
      location: '',
      dateOfBirth: '',
      address: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    });
    setFormErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status,
      location: user.location,
      dateOfBirth: user.dateOfBirth || '',
      address: user.address || '',
      emergencyContact: user.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      }
    });
    setFormErrors({});
    setModalMode('edit');
    setShowModal(true);
  };

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setModalMode('view');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        const newUser: Partial<User> = {
          ...formData,
          id: Date.now().toString(), // In real app, this would be generated by the backend
          joinDate: new Date().toISOString().split('T')[0],
          lastLogin: 'Never',
          isVerified: false,
          totalIncidents: 0,
          totalCheckIns: 0,
          safeIdShares: 0
        };
        
        if (onUserCreate) {
          await onUserCreate(newUser);
        }
      } else if (modalMode === 'edit' && selectedUser) {
        if (onUserUpdate) {
          await onUserUpdate(selectedUser.id, formData);
        }
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (userToDelete && onUserDelete) {
      try {
        await onUserDelete(userToDelete);
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckIcon className="h-3 w-3 mr-1" />
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
            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
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
        return 'bg-gray-100 text-gray-800';
      case 'brand_partner':
        return 'bg-purple-100 text-purple-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'accident_user':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRole = (role: string) => {
    switch (role) {
      case 'brand_partner':
        return 'Brand Partner';
      case 'admin':
        return 'Admin';
      case 'user':
        return 'App User';
      case 'accident_user':
        return 'Accident User';
      default:
        return role;
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    resetForm();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">User Management</h2>
          <p className="mt-1 text-gray-400">Create, view, edit, and manage user accounts</p>
        </div>
        <div className="flex items-center space-x-4">
          {onUserExport && (
            <button
              onClick={onUserExport}
              className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </button>
          )}
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add User
          </button>
          <div className="bg-gray-800 rounded-lg px-4 py-2 shadow-sm border border-gray-700">
            <div className="flex items-center space-x-2">
              <UsersIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-100">{filteredUsers.length}</span>
              <span className="text-sm text-gray-400">users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
              className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Roles</option>
              <option value="user">App Users</option>
              <option value="accident_user">Accident Users</option>
              <option value="brand_partner">Brand Partners</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-gray-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-200">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium text-gray-100">{user.name}</div>
                          {user.isVerified && (
                            <ShieldCheckIcon className="h-4 w-4 text-green-400" title="Verified" />
                          )}
                        </div>
                        <div className="text-sm text-gray-300">{user.email}</div>
                        <div className="text-xs text-gray-400">{user.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-100">
                      <div className="flex items-center space-x-4 text-xs">
                        <span title="Check-ins">📍 {user.totalCheckIns}</span>
                        <span title="Incidents">⚠️ {user.totalIncidents}</span>
                        <span title="Safe ID Shares">🛡️ {user.safeIdShares}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openViewModal(user)}
                        className="text-indigo-400 hover:text-indigo-300 p-1"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-green-400 hover:text-green-300 p-1"
                        title="Edit User"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete User"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal (Create/Edit/View) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border border-gray-700 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-100">
                {modalMode === 'create' ? 'Create New User' : 
                 modalMode === 'edit' ? 'Edit User' : 'User Details'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {modalMode === 'view' && selectedUser ? (
              // View Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Name</label>
                    <p className="mt-1 text-sm text-gray-100">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <p className="mt-1 text-sm text-gray-100">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Phone</label>
                    <p className="mt-1 text-sm text-gray-100">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Role</label>
                    <p className="mt-1 text-sm text-gray-100">{formatRole(selectedUser.role)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Join Date</label>
                    <p className="mt-1 text-sm text-gray-100">{selectedUser.joinDate}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300">Location</label>
                    <p className="mt-1 text-sm text-gray-100">{selectedUser.location}</p>
                  </div>
                  {selectedUser.address && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300">Address</label>
                      <p className="mt-1 text-sm text-gray-100">{selectedUser.address}</p>
                    </div>
                  )}
                </div>

                {/* Activity Stats */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-100 mb-3">Activity Statistics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-100">{selectedUser.totalCheckIns}</div>
                      <div className="text-sm text-gray-300">Check-ins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-100">{selectedUser.totalIncidents}</div>
                      <div className="text-sm text-gray-300">Incidents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-100">{selectedUser.safeIdShares}</div>
                      <div className="text-sm text-gray-300">Safe ID Shares</div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                {selectedUser.emergencyContact && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-100 mb-3">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300">Name</label>
                        <p className="text-sm text-gray-100">{selectedUser.emergencyContact.name}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300">Phone</label>
                        <p className="text-sm text-gray-100">{selectedUser.emergencyContact.phone}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300">Relationship</label>
                        <p className="text-sm text-gray-100">{selectedUser.emergencyContact.relationship}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Create/Edit Mode
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                        formErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                        formErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                        formErrors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="user">App User</option>
                      <option value="accident_user">Accident User</option>
                      <option value="brand_partner">Brand Partner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                      <option value="pending_verification">Pending Verification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                        formErrors.location ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.location && <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={2}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={formData.emergencyContact.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={formData.emergencyContact.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Relationship</label>
                      <input
                        type="text"
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => setFormData({
                          ...formData,
                          emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create User' : 'Update User'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-1/3 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete User</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 