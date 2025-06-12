import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  DocumentCheckIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  BellIcon,
  KeyIcon,
  LockClosedIcon,
  TrashIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

interface DataRequest {
  id: string;
  type: 'access' | 'deletion' | 'portability' | 'rectification';
  regulation: 'GDPR' | 'CCPA' | 'Other';
  userId: string;
  userEmail: string;
  requestDate: Date;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  notes?: string;
}

interface ConsentRecord {
  id: string;
  userId: string;
  userEmail: string;
  consentType: 'marketing' | 'analytics' | 'essential' | 'location' | 'data_sharing';
  status: 'granted' | 'denied' | 'withdrawn';
  timestamp: Date;
  method: 'explicit' | 'implicit' | 'pre_checked' | 'opt_in';
  ipAddress: string;
}

export default function PrivacyCompliance() {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'consent' | 'audits'>('overview');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [regulationFilter, setRegulationFilter] = useState<string>('all');

  const [dataRequests] = useState<DataRequest[]>([
    {
      id: '1',
      type: 'access',
      regulation: 'GDPR',
      userId: '1',
      userEmail: 'user1@example.com',
      requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      status: 'pending',
      priority: 'high',
      assignedTo: 'John Admin'
    },
    {
      id: '2',
      type: 'deletion',
      regulation: 'CCPA',
      userId: '2',
      userEmail: 'user2@example.com',
      requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'in_progress',
      priority: 'medium'
    }
  ]);

  const [consentRecords] = useState<ConsentRecord[]>([
    {
      id: '1',
      userId: '1',
      userEmail: 'user1@example.com',
      consentType: 'marketing',
      status: 'granted',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      method: 'explicit',
      ipAddress: '192.168.1.1'
    }
  ]);

  const stats = {
    pendingRequests: dataRequests.filter(r => r.status === 'pending').length,
    overdueTasks: dataRequests.filter(r => new Date() > r.dueDate && r.status !== 'completed').length,
    complianceScore: 92,
    consentRate: 78.5,
    totalRequests: dataRequests.length,
    avgResponseTime: '18 hours'
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-900/50 text-yellow-300',
      in_progress: 'bg-blue-900/50 text-blue-300',
      completed: 'bg-green-900/50 text-green-300',
      rejected: 'bg-red-900/50 text-red-300',
      granted: 'bg-green-900/50 text-green-300',
      denied: 'bg-red-900/50 text-red-300',
      withdrawn: 'bg-gray-600/50 text-gray-300'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-600/50 text-gray-300';
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Privacy & Compliance</h1>
            <p className="text-gray-400 mt-1">GDPR, CCPA compliance management and data protection oversight</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-900/50 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">{stats.pendingRequests}</p>
                <p className="text-sm text-gray-400">Pending Requests</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-900/50 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">{stats.overdueTasks}</p>
                <p className="text-sm text-gray-400">Overdue Tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-900/50 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">{stats.complianceScore}%</p>
                <p className="text-sm text-gray-400">Compliance Score</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-900/50 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">{stats.consentRate}%</p>
                <p className="text-sm text-gray-400">Consent Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: ShieldCheckIcon },
              { key: 'requests', label: 'Data Requests', icon: DocumentTextIcon },
              { key: 'consent', label: 'Consent Management', icon: UserIcon },
              { key: 'audits', label: 'Audit Logs', icon: DocumentCheckIcon }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Compliance Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Compliance Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">GDPR Compliance</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                      <span className="text-sm text-gray-300">95%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">CCPA Compliance</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                      <span className="text-sm text-gray-300">88%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Data Retention</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                      <span className="text-sm text-gray-300">72%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-900/50 rounded-lg">
                      <CheckCircleIcon className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-100">Data access request completed</p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-900/50 rounded-lg">
                      <UserIcon className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-100">New consent recorded</p>
                      <p className="text-xs text-gray-400">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-900/50 rounded-lg">
                      <ClockIcon className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-100">Deletion request pending</p>
                      <p className="text-xs text-gray-400">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                  <DocumentTextIcon className="h-6 w-6 text-purple-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-100">Generate Report</p>
                    <p className="text-xs text-gray-400">Compliance summary</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                  <ArrowDownTrayIcon className="h-6 w-6 text-purple-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-100">Export Data</p>
                    <p className="text-xs text-gray-400">Download records</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                  <BellIcon className="h-6 w-6 text-purple-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-100">Set Alerts</p>
                    <p className="text-xs text-gray-400">Configure notifications</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Regulation</label>
                  <select
                    value={regulationFilter}
                    onChange={(e) => setRegulationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Regulations</option>
                    <option value="GDPR">GDPR</option>
                    <option value="CCPA">CCPA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-gray-100">Data Requests</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Request
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {dataRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-100">#{request.id}</div>
                            <div className="text-sm text-gray-400">{request.regulation}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-100">{request.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300">
                            {request.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {request.dueDate.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg">
                              <ArrowDownTrayIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Consent Management Tab */}
        {activeTab === 'consent' && (
          <div className="space-y-6">
            {/* Consent Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-900/50 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">
                      {consentRecords.filter(c => c.status === 'granted').length}
                    </p>
                    <p className="text-sm text-gray-400">Granted</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-900/50 rounded-lg">
                    <XCircleIcon className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">
                      {consentRecords.filter(c => c.status === 'denied').length}
                    </p>
                    <p className="text-sm text-gray-400">Denied</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-600/50 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">
                      {consentRecords.filter(c => c.status === 'withdrawn').length}
                    </p>
                    <p className="text-sm text-gray-400">Withdrawn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Consent Records Table */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-gray-100">Consent Records</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Consent Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {consentRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-100">{record.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300">
                            {record.consentType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {record.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {record.timestamp.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audits' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Audit Trail</h3>
              <div className="bg-gray-700 rounded-lg p-8 text-center">
                <DocumentCheckIcon className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                <p className="text-gray-400">Audit logs functionality would be implemented here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Comprehensive logging of all privacy-related activities
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
} 