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
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      granted: 'bg-green-100 text-green-800',
      denied: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Privacy & Compliance</h1>
          <p className="mt-2 text-gray-600">
            GDPR, CCPA compliance management and data protection oversight
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Requests</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.pendingRequests}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Overdue Tasks</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.overdueTasks}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Compliance Score</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.complianceScore}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Consent Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.consentRate}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: ShieldCheckIcon },
              { key: 'requests', label: 'Data Requests', icon: DocumentTextIcon },
              { key: 'consent', label: 'Consent Management', icon: UserIcon },
              { key: 'audits', label: 'Audit Logs', icon: DocumentCheckIcon }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Compliance Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">GDPR Compliance</div>
                      <div className="text-sm text-gray-500">Last audit: 2024-01-15</div>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-600">94%</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">CCPA Compliance</div>
                      <div className="text-sm text-gray-500">Last audit: 2024-01-10</div>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">90%</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <LockClosedIcon className="h-6 w-6 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Data Security</div>
                      <div className="text-sm text-gray-500">Encryption & access controls</div>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">96%</span>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-3">
                {dataRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        {request.type} request
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.userEmail} • {request.regulation}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Data Requests Tab */}
        {activeTab === 'requests' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Data Subject Requests</h2>
                <div className="flex space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <select
                    value={regulationFilter}
                    onChange={(e) => setRegulationFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                  >
                    <option value="all">All Regulations</option>
                    <option value="GDPR">GDPR</option>
                    <option value="CCPA">CCPA</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Regulation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{request.type} Request</div>
                          <div className="text-sm text-gray-500">ID: {request.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{request.userEmail}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {request.regulation}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {request.dueDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
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
        )}

        {/* Consent Management Tab */}
        {activeTab === 'consent' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Consent Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">78.5%</div>
                  <div className="text-sm text-gray-500">Overall Consent Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">12,453</div>
                  <div className="text-sm text-gray-500">Total Consents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">234</div>
                  <div className="text-sm text-gray-500">Withdrawals This Month</div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Consent Records</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consent Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {consentRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{record.userEmail}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{record.consentType}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{record.method}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {record.timestamp.toLocaleDateString()}
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
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Compliance Audit Logs</h2>
            <div className="text-center py-8">
              <DocumentCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Audit Log System</h3>
              <p className="text-gray-500">Detailed audit trails and compliance reports would be displayed here</p>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
} 