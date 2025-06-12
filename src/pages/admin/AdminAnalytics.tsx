import React, { useState, useMemo } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  EyeIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

// Mock data for analytics
const usersData = [
  {
    id: '1',
    name: 'Alice Driver',
    email: 'alice.driver@example.com',
    role: 'accident_user',
    safeId: 'SF-4X8K-9M2L-R7B3',
    safeIdShares: 15,
    insuranceProviders: ['State Farm', 'Geico'],
    location: 'Chicago, IL',
    adImpressions: 245,
    adClicks: 23,
    offersViewed: 12,
    offersRedeemed: 5,
    joinDate: '2024-01-08',
    lastActive: '2024-01-21'
  },
  {
    id: '2',
    name: 'Bob Commuter',
    email: 'bob.commuter@example.com',
    role: 'accident_user',
    safeId: 'SF-7N9P-3K5M-T2W6',
    safeIdShares: 8,
    insuranceProviders: ['Progressive'],
    location: 'Houston, TX',
    adImpressions: 189,
    adClicks: 34,
    offersViewed: 18,
    offersRedeemed: 7,
    joinDate: '2024-01-18',
    lastActive: '2024-01-20'
  },
  {
    id: '3',
    name: 'Carol Cyclist',
    email: 'carol.cyclist@example.com',
    role: 'accident_user',
    safeId: 'SF-2B8F-6H4K-X9L1',
    safeIdShares: 0,
    insuranceProviders: [],
    location: 'San Francisco, CA',
    adImpressions: 156,
    adClicks: 12,
    offersViewed: 8,
    offersRedeemed: 2,
    joinDate: '2024-02-03',
    lastActive: '2024-02-03'
  },
  {
    id: '4',
    name: 'David Walker',
    email: 'david.walker@example.com',
    role: 'accident_user',
    safeId: 'SF-1M7Q-4R2N-V5T8',
    safeIdShares: 23,
    insuranceProviders: ['Allstate', 'State Farm'],
    location: 'Miami, FL',
    adImpressions: 312,
    adClicks: 45,
    offersViewed: 25,
    offersRedeemed: 11,
    joinDate: '2023-12-15',
    lastActive: '2024-01-10'
  },
  {
    id: '5',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@example.com',
    role: 'accident_user',
    safeId: 'SF-9K3L-5M8P-A4C7',
    safeIdShares: 12,
    insuranceProviders: ['Geico'],
    location: 'Phoenix, AZ',
    adImpressions: 198,
    adClicks: 28,
    offersViewed: 15,
    offersRedeemed: 6,
    joinDate: '2024-01-25',
    lastActive: '2024-01-21'
  },
  {
    id: '6',
    name: 'Frank Miller',
    email: 'frank.miller@example.com',
    role: 'brand_partner',
    safeId: null,
    safeIdShares: 0,
    insuranceProviders: [],
    location: 'Seattle, WA',
    adImpressions: 1250,
    adClicks: 89,
    offersViewed: 45,
    offersRedeemed: 23,
    joinDate: '2024-01-12',
    lastActive: '2024-01-21'
  },
  {
    id: '7',
    name: 'Grace Chen',
    email: 'grace.chen@example.com',
    role: 'accident_user',
    safeId: 'SF-8V2N-6Q9R-B5D1',
    safeIdShares: 6,
    insuranceProviders: ['Progressive', 'State Farm'],
    location: 'Denver, CO',
    adImpressions: 167,
    adClicks: 19,
    offersViewed: 11,
    offersRedeemed: 4,
    joinDate: '2024-02-01',
    lastActive: '2024-02-02'
  }
];

const insuranceCompanies = [
  { name: 'State Farm', userCount: 3, color: 'bg-blue-500' },
  { name: 'Progressive', userCount: 2, color: 'bg-green-500' },
  { name: 'Geico', userCount: 2, color: 'bg-yellow-500' },
  { name: 'Allstate', userCount: 1, color: 'bg-red-500' }
];

type FilterPeriod = '7d' | '30d' | '90d' | 'all';

export default function AdminAnalytics() {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'safeId' | 'insurance' | 'ads'>('all');

  // Calculate analytics data
  const analytics = useMemo(() => {
    const accidentUsers = usersData.filter(user => user.role === 'accident_user');
    const usersWithSafeId = accidentUsers.filter(user => user.safeId);
    const usersWithInsurance = accidentUsers.filter(user => user.insuranceProviders.length > 0);
    const usersWhoSawAds = usersData.filter(user => user.adImpressions > 0);
    const usersWhoRedeemedOffers = usersData.filter(user => user.offersRedeemed > 0);

    const totalSafeIdShares = accidentUsers.reduce((sum, user) => sum + user.safeIdShares, 0);
    const averageSafeIdShares = usersWithSafeId.length > 0 ? totalSafeIdShares / usersWithSafeId.length : 0;

    const totalAdImpressions = usersData.reduce((sum, user) => sum + user.adImpressions, 0);
    const totalAdClicks = usersData.reduce((sum, user) => sum + user.adClicks, 0);
    const totalOffersRedeemed = usersData.reduce((sum, user) => sum + user.offersRedeemed, 0);

    return {
      totalUsers: usersData.length,
      accidentUsers: accidentUsers.length,
      usersWithSafeId: usersWithSafeId.length,
      usersWithInsurance: usersWithInsurance.length,
      usersWhoSawAds: usersWhoSawAds.length,
      usersWhoRedeemedOffers: usersWhoRedeemedOffers.length,
      totalSafeIdShares,
      averageSafeIdShares,
      totalAdImpressions,
      totalAdClicks,
      totalOffersRedeemed,
      clickThroughRate: totalAdImpressions > 0 ? (totalAdClicks / totalAdImpressions * 100) : 0,
      redemptionRate: usersWhoSawAds.length > 0 ? (usersWhoRedeemedOffers.length / usersWhoSawAds.length * 100) : 0
    };
  }, []);

  const exportData = () => {
    const csvData = [
      ['User Name', 'Email', 'Role', 'Safe ID', 'Safe ID Shares', 'Insurance Providers', 'Ad Impressions', 'Ad Clicks', 'Offers Viewed', 'Offers Redeemed', 'Location'],
      ...usersData.map(user => [
        user.name,
        user.email,
        user.role,
        user.safeId || 'N/A',
        user.safeIdShares.toString(),
        user.insuranceProviders.join('; ') || 'None',
        user.adImpressions.toString(),
        user.adClicks.toString(),
        user.offersViewed.toString(),
        user.offersRedeemed.toString(),
        user.location
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `admin-analytics-${new Date().toISOString().split('T')[0]}.csv`);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Comprehensive user behavior and system performance analytics</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as FilterPeriod)}
              className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-900/50 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">{analytics.totalUsers}</p>
                <p className="text-sm text-gray-400">Total Users</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-900/50 rounded-lg">
                <IdentificationIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">{analytics.usersWithSafeId}</p>
                <p className="text-sm text-gray-400">Safe ID Users</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-900/50 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">{analytics.usersWithInsurance}</p>
                <p className="text-sm text-gray-400">Insurance Connected</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-900/50 rounded-lg">
                <EyeIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">{analytics.totalAdImpressions.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Ad Impressions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Safe ID Performance</h3>
              <IdentificationIcon className="h-5 w-5 text-purple-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Shares:</span>
                <span className="text-gray-100 font-medium">{analytics.totalSafeIdShares}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Average per User:</span>
                <span className="text-gray-100 font-medium">{analytics.averageSafeIdShares.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Adoption Rate:</span>
                <span className="text-gray-100 font-medium">
                  {((analytics.usersWithSafeId / analytics.accidentUsers) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Ad Performance</h3>
              <ChartBarIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Clicks:</span>
                <span className="text-gray-100 font-medium">{analytics.totalAdClicks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">CTR:</span>
                <span className="text-gray-100 font-medium">{analytics.clickThroughRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Redemptions:</span>
                <span className="text-gray-100 font-medium">{analytics.totalOffersRedeemed}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Insurance Integration</h3>
              <BuildingOfficeIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="space-y-3">
              {insuranceCompanies.map((company) => (
                <div key={company.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${company.color}`}></div>
                    <span className="text-gray-300">{company.name}</span>
                  </div>
                  <span className="text-gray-100 font-medium">{company.userCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Analytics Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-100">User Analytics</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as any)}
                  className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Metrics</option>
                  <option value="safeId">Safe ID Only</option>
                  <option value="insurance">Insurance Only</option>
                  <option value="ads">Ads Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Safe ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Insurance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ad Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {usersData.filter(user => user.role === 'accident_user').map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-900/50 rounded-lg mr-3">
                          <UserGroupIcon className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-100">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.safeId ? (
                        <div>
                          <div className="text-sm text-gray-100">{user.safeId}</div>
                          <div className="text-xs text-gray-400">{user.safeIdShares} shares</div>
                        </div>
                      ) : (
                        <span className="text-gray-500">No Safe ID</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.insuranceProviders.length > 0 ? (
                        <div className="space-y-1">
                          {user.insuranceProviders.map((provider, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300"
                            >
                              {provider}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-100">
                        {user.adImpressions} impressions
                      </div>
                      <div className="text-xs text-gray-400">
                        {user.adClicks} clicks • {user.offersRedeemed} redeemed
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-100">
                        <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {user.location}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
} 