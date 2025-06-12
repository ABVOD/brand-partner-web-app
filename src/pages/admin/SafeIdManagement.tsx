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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Suspended
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600/50 text-gray-300">
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
            <h1 className="text-2xl font-bold text-gray-100">Safe ID Management</h1>
            <p className="mt-1 text-gray-400">
              Monitor and manage Safe IDs for accident users and insurance integration
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-900/50 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">
                  {safeIds.filter(s => s.status === 'active').length}
                </p>
                <p className="text-sm text-gray-400">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-900/50 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">
                  {safeIds.filter(s => s.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-900/50 rounded-lg">
                <IdentificationIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">
                  {safeIds.reduce((sum, s) => sum + s.shareCount, 0)}
                </p>
                <p className="text-sm text-gray-400">Total Shares</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-900/50 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">
                  {safeIds.reduce((sum, s) => sum + s.insuranceShares.length, 0)}
                </p>
                <p className="text-sm text-gray-400">Insurance Shares</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Safe IDs, users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Safe IDs Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Safe ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredSafeIds.map((safeId) => (
                  <tr key={safeId.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-900/50 rounded-lg mr-3">
                          <IdentificationIcon className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-100">{safeId.safeId}</div>
                          <div className="text-xs text-gray-400">
                            Created: {formatDate(safeId.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-100">{safeId.userName}</div>
                        <div className="text-sm text-gray-400">{safeId.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(safeId.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-100">
                        {safeId.shareCount} shares
                      </div>
                      <div className="text-xs text-gray-400">
                        Last used: {formatDate(safeId.lastUsed)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-100">{safeId.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(safeId)}
                          className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => copyToClipboard(safeId.safeId)}
                          className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredSafeIds.length === 0 && (
          <div className="text-center py-12">
            <IdentificationIcon className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-100">No Safe IDs found</h3>
            <p className="mt-1 text-sm text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedSafeId && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}></div>
              <div className="relative w-full max-w-2xl mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-100">Safe ID Details</h3>
                      <button
                        onClick={() => setShowDetailModal(false)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <XCircleIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-4 space-y-6">
                    {/* Safe ID Header */}
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-900/50 rounded-lg">
                        <IdentificationIcon className="h-8 w-8 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-100">{selectedSafeId.safeId}</h4>
                        <p className="text-gray-400">{selectedSafeId.userName}</p>
                        <div className="mt-2">
                          {getStatusBadge(selectedSafeId.status)}
                        </div>
                      </div>
                    </div>

                    {/* User Information */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-2">User Information</h5>
                      <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="text-gray-100">{selectedSafeId.userName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span className="text-gray-100">{selectedSafeId.userEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Location:</span>
                          <span className="text-gray-100">{selectedSafeId.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Usage Statistics */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-2">Usage Statistics</h5>
                      <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Shares:</span>
                          <span className="text-gray-100">{selectedSafeId.shareCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Created:</span>
                          <span className="text-gray-100">{formatDate(selectedSafeId.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Used:</span>
                          <span className="text-gray-100">{formatDate(selectedSafeId.lastUsed)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Insurance Shares */}
                    {selectedSafeId.insuranceShares.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Insurance Shares</h5>
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="space-y-3">
                            {selectedSafeId.insuranceShares.map((share, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                                <div>
                                  <div className="text-sm font-medium text-gray-100">{share.provider}</div>
                                  {share.claimId && (
                                    <div className="text-xs text-gray-400">Claim: {share.claimId}</div>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {formatDate(share.sharedAt)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => copyToClipboard(selectedSafeId.safeId)}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                    >
                      Copy Safe ID
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