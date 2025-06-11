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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Comprehensive analytics for Safe ID sharing, insurance coverage, and ad engagement
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as FilterPeriod)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-blue-50 p-3">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">{analytics.accidentUsers} accident users</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-green-50 p-3">
                  <IdentificationIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Safe ID Shares</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalSafeIdShares}</p>
                <p className="text-xs text-gray-500 mt-1">{analytics.averageSafeIdShares.toFixed(1)} avg per user</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-purple-50 p-3">
                  <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Insurance Coverage</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.usersWithInsurance}</p>
                <p className="text-xs text-gray-500 mt-1">users covered</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-orange-50 p-3">
                  <CheckCircleIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Offer Redemptions</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalOffersRedeemed}</p>
                <p className="text-xs text-gray-500 mt-1">{analytics.redemptionRate.toFixed(1)}% rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Safe ID Sharing Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Safe ID Sharing Analytics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Safe ID Distribution */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Safe ID Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Users with Safe ID</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.usersWithSafeId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Users without Safe ID</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.accidentUsers - analytics.usersWithSafeId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Safe ID Shares</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.totalSafeIdShares}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Shares per User</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.averageSafeIdShares.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Top Safe ID Users */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Top Safe ID Sharers</h3>
                <div className="space-y-3">
                  {usersData
                    .filter(user => user.safeId)
                    .sort((a, b) => b.safeIdShares - a.safeIdShares)
                    .slice(0, 5)
                    .map(user => (
                      <div key={user.id} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.location}</p>
                        </div>
                        <span className="text-sm font-medium text-blue-600">{user.safeIdShares} shares</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Coverage Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Insurance Coverage Analytics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Insurance Provider Distribution */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Coverage by Insurance Provider</h3>
                <div className="space-y-3">
                  {insuranceCompanies.map(company => (
                    <div key={company.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${company.color}`}></div>
                        <span className="text-sm text-gray-900">{company.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{company.userCount} users</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Coverage Rate</span>
                    <span className="text-sm font-medium text-gray-900">
                      {((analytics.usersWithInsurance / analytics.accidentUsers) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Users by Insurance Status */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Users by Insurance Status</h3>
                <div className="space-y-3">
                  {usersData
                    .filter(user => user.role === 'accident_user')
                    .map(user => (
                      <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.location}</p>
                        </div>
                        <div className="text-right">
                          {user.insuranceProviders.length > 0 ? (
                            <div className="space-y-1">
                              {user.insuranceProviders.map(provider => (
                                <span key={provider} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  {provider}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">No Coverage</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Engagement Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ad Engagement & Offer Redemption Analytics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ad Performance Metrics */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Ad Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Impressions</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.totalAdImpressions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Clicks</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.totalAdClicks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Click-Through Rate</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.clickThroughRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Users Who Saw Ads</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.usersWhoSawAds}</span>
                  </div>
                </div>
              </div>

              {/* Offer Redemption Metrics */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Offer Redemptions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Redemptions</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.totalOffersRedeemed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Users Who Redeemed</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.usersWhoRedeemedOffers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Redemption Rate</span>
                    <span className="text-sm font-medium text-gray-900">{analytics.redemptionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Redemptions per User</span>
                    <span className="text-sm font-medium text-gray-900">
                      {analytics.usersWhoRedeemedOffers > 0 ? (analytics.totalOffersRedeemed / analytics.usersWhoRedeemedOffers).toFixed(1) : '0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Engaged Users */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Most Engaged Users</h3>
                <div className="space-y-3">
                  {usersData
                    .sort((a, b) => (b.adClicks + b.offersRedeemed) - (a.adClicks + a.offersRedeemed))
                    .slice(0, 5)
                    .map(user => (
                      <div key={user.id} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.role === 'brand_partner' ? 'Brand Partner' : 'Accident User'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{user.adClicks} clicks</p>
                          <p className="text-xs text-gray-500">{user.offersRedeemed} redemptions</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Detailed User Engagement Table */}
            <div className="mt-8">
              <h3 className="text-md font-medium text-gray-900 mb-4">Detailed User Engagement</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Impressions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Clicks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offers Viewed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offers Redeemed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usersData.map(user => {
                      const ctr = user.adImpressions > 0 ? (user.adClicks / user.adImpressions * 100) : 0;
                      return (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.location}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'brand_partner' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role === 'brand_partner' ? 'Brand Partner' : 'Accident User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.adImpressions}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.adClicks}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.offersViewed}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.offersRedeemed}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ctr.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
} 