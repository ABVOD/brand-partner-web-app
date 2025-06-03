import { useState } from 'react';
import {
  IdentificationIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

interface SafeId {
  id: string;
  safeId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'active' | 'expired' | 'suspended' | 'pending';
  createdAt: string;
  lastUsed: string;
  shareCount: number;
  insuranceShares: {
    provider: string;
    sharedAt: string;
    claimId?: string;
  }[];
  location: string;
}

export default function SafeIdManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSafeId, setSelectedSafeId] = useState<SafeId | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock data - in a real app, this would come from your backend
  const safeIds: SafeId[] = [
    {
      id: '1',
      safeId: 'SF-4X8K-9M2L-R7B3',
      userId: '3',
      userName: 'Alice Driver',
      userEmail: 'alice.driver@example.com',
      status: 'active',
      createdAt: '2024-01-08T10:30:00Z',
      lastUsed: '2024-01-20T14:30:00Z',
      shareCount: 15,
      insuranceShares: [
        { provider: 'State Farm', sharedAt: '2024-01-20T14:30:00Z', claimId: 'SF-2024-001234' },
        { provider: 'Geico', sharedAt: '2024-01-18T09:15:00Z', claimId: 'GC-2024-005678' }
      ],
      location: 'Chicago, IL'
    },
    {
      id: '2',
      safeId: 'SF-7N9P-3K5M-T2W6',
      userId: '4',
      userName: 'Bob Commuter',
      userEmail: 'bob.commuter@example.com',
      status: 'active',
      createdAt: '2024-01-18T16:45:00Z',
      lastUsed: '2024-01-19T11:20:00Z',
      shareCount: 8,
      insuranceShares: [
        { provider: 'Progressive', sharedAt: '2024-01-19T11:20:00Z', claimId: 'PG-2024-009876' }
      ],
      location: 'Houston, TX'
    },
    {
      id: '3',
      safeId: 'SF-2B8F-6H4K-X9L1',
      userId: '5',
      userName: 'Carol Cyclist',
      userEmail: 'carol.cyclist@example.com',
      status: 'pending',
      createdAt: '2024-02-03T08:15:00Z',
      lastUsed: 'Never',
      shareCount: 0,
      insuranceShares: [],
      location: 'San Francisco, CA'
    },
    {
      id: '4',
      safeId: 'SF-1M7Q-4R2N-V5T8',
      userId: '6',
      userName: 'David Walker',
      userEmail: 'david.walker@example.com',
      status: 'suspended',
      createdAt: '2023-12-15T12:30:00Z',
      lastUsed: '2024-01-10T16:45:00Z',
      shareCount: 23,
      insuranceShares: [
        { provider: 'Allstate', sharedAt: '2024-01-10T16:45:00Z', claimId: 'AS-2024-112233' },
        { provider: 'State Farm', sharedAt: '2024-01-05T10:30:00Z' }
      ],
      location: 'Miami, FL'
    }
  ];

  const filteredSafeIds = safeIds.filter(safeId => {
    const matchesSearch = safeId.safeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         safeId.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         safeId.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || safeId.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Suspended
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'Never') return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewDetails = (safeId: SafeId) => {
    setSelectedSafeId(safeId);
    setShowDetailModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could show a toast notification here
  };

  const exportData = () => {
    const csvData = [
      ['Safe ID', 'User Name', 'Email', 'Status', 'Created', 'Last Used', 'Share Count', 'Location'],
      ...filteredSafeIds.map(safeId => [
        safeId.safeId,
        safeId.userName,
        safeId.userEmail,
        safeId.status,
        formatDate(safeId.createdAt),
        formatDate(safeId.lastUsed),
        safeId.shareCount.toString(),
        safeId.location
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `safe-ids-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Safe ID Management</h1>
            <p className="mt-2 text-gray-600">
              Monitor and manage Safe IDs for accident users and insurance integration
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </button>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <IdentificationIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{filteredSafeIds.length}</span>
                <span className="text-sm text-gray-500">Safe IDs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Safe IDs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {safeIds.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Insurance Shares</p>
                <p className="text-2xl font-bold text-gray-900">
                  {safeIds.reduce((sum, s) => sum + s.insuranceShares.length, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {safeIds.filter(s => s.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-gray-900">
                  {safeIds.filter(s => s.status === 'suspended').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Safe ID, user name, or email..."
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
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Safe IDs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Safe ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Share Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Used
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSafeIds.map((safeId) => (
                  <tr key={safeId.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {safeId.safeId}
                        </code>
                        <button
                          onClick={() => copyToClipboard(safeId.safeId)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{safeId.userName}</div>
                        <div className="text-sm text-gray-500">{safeId.userEmail}</div>
                        <div className="text-xs text-gray-400">{safeId.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(safeId.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{safeId.shareCount}</div>
                      <div className="text-xs text-gray-500">
                        {safeId.insuranceShares.length} insurance shares
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(safeId.lastUsed)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(safeId)}
                        className="text-red-600 hover:text-red-900 mr-4"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedSafeId && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Safe ID Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Safe ID</label>
                    <div className="mt-1 flex items-center">
                      <code className="text-lg font-mono bg-gray-100 px-3 py-2 rounded">
                        {selectedSafeId.safeId}
                      </code>
                      <button
                        onClick={() => copyToClipboard(selectedSafeId.safeId)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <DocumentDuplicateIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedSafeId.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSafeId.userName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSafeId.userEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedSafeId.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Used</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedSafeId.lastUsed)}</p>
                  </div>
                </div>

                {/* Insurance Shares */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Insurance Shares</h4>
                  {selectedSafeId.insuranceShares.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSafeId.insuranceShares.map((share, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                              <div>
                                <p className="font-medium text-gray-900">{share.provider}</p>
                                <p className="text-sm text-gray-500">
                                  Shared on {formatDate(share.sharedAt)}
                                </p>
                              </div>
                            </div>
                            {share.claimId && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {share.claimId}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No insurance shares yet</p>
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