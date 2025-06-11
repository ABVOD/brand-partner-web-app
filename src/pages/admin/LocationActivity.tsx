import React, { useState, useMemo } from 'react';
import {
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  ChartBarIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  TagIcon,
  ArrowDownTrayIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

interface LocationActivity {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  activityType: 'safe_id_share' | 'campaign_view' | 'offer_redeem' | 'incident_report' | 'insurance_check';
  userId: string;
  userName: string;
  userType: 'accident_user' | 'brand_partner';
  timestamp: Date;
  details: any;
}

interface LocationStats {
  totalActivities: number;
  uniqueLocations: number;
  safeIdShares: number;
  campaignViews: number;
  offerRedemptions: number;
  incidentReports: number;
  averageActivityPerLocation: number;
  peakActivityHour: number;
}

interface HeatmapData {
  lat: number;
  lng: number;
  intensity: number;
  activities: number;
  location: string;
}

export default function LocationActivity() {
  const [activeTab, setActiveTab] = useState<'overview' | 'heatmap' | 'activities' | 'analytics'>('overview');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [activityFilter, setActivityFilter] = useState<'all' | 'safe_id_share' | 'campaign_view' | 'offer_redeem' | 'incident_report'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  // Mock data - in real app, this would come from API
  const [activities] = useState<LocationActivity[]>([
    {
      id: '1',
      latitude: 41.8781,
      longitude: -87.6298,
      address: '123 Michigan Ave',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      activityType: 'safe_id_share',
      userId: '1',
      userName: 'Alice Driver',
      userType: 'accident_user',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      details: { shareMethod: 'qr_code', emergencyContact: 'John Doe' }
    },
    {
      id: '2',
      latitude: 29.7604,
      longitude: -95.3698,
      address: '456 Main St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77002',
      activityType: 'campaign_view',
      userId: '2',
      userName: 'Bob Commuter',
      userType: 'accident_user',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      details: { campaignId: 'camp_1', brandName: 'Auto Insurance Co' }
    },
    {
      id: '3',
      latitude: 37.7749,
      longitude: -122.4194,
      address: '789 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      activityType: 'offer_redeem',
      userId: '3',
      userName: 'Carol Cyclist',
      userType: 'accident_user',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      details: { offerId: 'offer_1', discountAmount: 15, brandName: 'Safe Gear Co' }
    },
    {
      id: '4',
      latitude: 40.7128,
      longitude: -74.0060,
      address: '321 Broadway',
      city: 'New York',
      state: 'NY',
      zipCode: '10007',
      activityType: 'incident_report',
      userId: '4',
      userName: 'David Walker',
      userType: 'accident_user',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      details: { incidentType: 'vehicle_accident', severity: 'minor', reportedToInsurance: true }
    },
    {
      id: '5',
      latitude: 33.4484,
      longitude: -112.0740,
      address: '654 Central Ave',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85004',
      activityType: 'insurance_check',
      userId: '5',
      userName: 'Emma Driver',
      userType: 'accident_user',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      details: { insuranceProvider: 'State Farm', policyStatus: 'active' }
    }
  ]);

  // Calculate stats
  const stats: LocationStats = useMemo(() => {
    const filteredActivities = activities.filter(activity => {
      const now = Date.now();
      const activityTime = activity.timestamp.getTime();
      
      let timeFilter = true;
      switch (timeRange) {
        case '24h':
          timeFilter = now - activityTime < 24 * 60 * 60 * 1000;
          break;
        case '7d':
          timeFilter = now - activityTime < 7 * 24 * 60 * 60 * 1000;
          break;
        case '30d':
          timeFilter = now - activityTime < 30 * 24 * 60 * 60 * 1000;
          break;
        case '90d':
          timeFilter = now - activityTime < 90 * 24 * 60 * 60 * 1000;
          break;
      }

      return timeFilter;
    });

    const uniqueLocations = new Set(filteredActivities.map(a => `${a.latitude},${a.longitude}`)).size;
    const safeIdShares = filteredActivities.filter(a => a.activityType === 'safe_id_share').length;
    const campaignViews = filteredActivities.filter(a => a.activityType === 'campaign_view').length;
    const offerRedemptions = filteredActivities.filter(a => a.activityType === 'offer_redeem').length;
    const incidentReports = filteredActivities.filter(a => a.activityType === 'incident_report').length;

    // Calculate peak hour
    const hourCounts = new Array(24).fill(0);
    filteredActivities.forEach(activity => {
      const hour = activity.timestamp.getHours();
      hourCounts[hour]++;
    });
    const peakActivityHour = hourCounts.indexOf(Math.max(...hourCounts));

    return {
      totalActivities: filteredActivities.length,
      uniqueLocations,
      safeIdShares,
      campaignViews,
      offerRedemptions,
      incidentReports,
      averageActivityPerLocation: uniqueLocations > 0 ? filteredActivities.length / uniqueLocations : 0,
      peakActivityHour
    };
  }, [activities, timeRange]);

  // Generate heatmap data
  const heatmapData: HeatmapData[] = useMemo(() => {
    const locationMap = new Map<string, { count: number; lat: number; lng: number; location: string }>();

    activities.forEach(activity => {
      const key = `${activity.latitude},${activity.longitude}`;
      const existing = locationMap.get(key);
      
      if (existing) {
        existing.count++;
      } else {
        locationMap.set(key, {
          count: 1,
          lat: activity.latitude,
          lng: activity.longitude,
          location: `${activity.city}, ${activity.state}`
        });
      }
    });

    const maxCount = Math.max(...Array.from(locationMap.values()).map(v => v.count));

    return Array.from(locationMap.values()).map(data => ({
      lat: data.lat,
      lng: data.lng,
      intensity: data.count / maxCount,
      activities: data.count,
      location: data.location
    }));
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      let matches = true;

      // Activity type filter
      if (activityFilter !== 'all') {
        matches = matches && activity.activityType === activityFilter;
      }

      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        matches = matches && (
          activity.address.toLowerCase().includes(searchLower) ||
          activity.city.toLowerCase().includes(searchLower) ||
          activity.state.toLowerCase().includes(searchLower) ||
          activity.userName.toLowerCase().includes(searchLower)
        );
      }

      return matches;
    });
  }, [activities, activityFilter, searchQuery]);

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'safe_id_share': return 'bg-blue-100 text-blue-800';
      case 'campaign_view': return 'bg-purple-100 text-purple-800';
      case 'offer_redeem': return 'bg-green-100 text-green-800';
      case 'incident_report': return 'bg-red-100 text-red-800';
      case 'insurance_check': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'safe_id_share': return IdentificationIcon;
      case 'campaign_view': return EyeIcon;
      case 'offer_redeem': return TagIcon;
      case 'incident_report': return ExclamationTriangleIcon;
      case 'insurance_check': return BuildingOfficeIcon;
      default: return MapPinIcon;
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Timestamp', 'Location', 'Activity Type', 'User', 'User Type', 'Details'].join(','),
      ...filteredActivities.map(activity => [
        activity.timestamp.toISOString(),
        `"${activity.address}, ${activity.city}, ${activity.state}"`,
        activity.activityType,
        activity.userName,
        activity.userType,
        `"${JSON.stringify(activity.details)}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `location-activity-${timeRange}-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Location Activity</h1>
            <p className="mt-2 text-gray-600">
              Monitor user activity patterns and location-based insights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Activities</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalActivities}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MapPinIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Unique Locations</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.uniqueLocations}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <IdentificationIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Safe ID Shares</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.safeIdShares}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-orange-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Peak Hour</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.peakActivityHour}:00
                    </dd>
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
              { key: 'overview', label: 'Overview', icon: ChartBarIcon },
              { key: 'heatmap', label: 'Heatmap', icon: GlobeAltIcon },
              { key: 'activities', label: 'Activity Log', icon: ClockIcon },
              { key: 'analytics', label: 'Analytics', icon: ArrowTrendingUpIcon }
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
            {/* Activity Breakdown */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Activity Breakdown</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <IdentificationIcon className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Safe ID Shares</div>
                      <div className="text-sm text-gray-500">Emergency contact sharing</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{stats.safeIdShares}</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <EyeIcon className="h-6 w-6 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Campaign Views</div>
                      <div className="text-sm text-gray-500">Brand campaign interactions</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{stats.campaignViews}</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TagIcon className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Offer Redemptions</div>
                      <div className="text-sm text-gray-500">Promotional offers used</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{stats.offerRedemptions}</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    <div>
                      <div className="font-medium text-gray-900">Incident Reports</div>
                      <div className="text-sm text-gray-500">Accidents and incidents</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{stats.incidentReports}</div>
                </div>
              </div>
            </div>

            {/* Top Locations */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Most Active Locations</h2>
              
              <div className="space-y-3">
                {heatmapData
                  .sort((a, b) => b.activities - a.activities)
                  .slice(0, 5)
                  .map((location, index) => (
                    <div key={`${location.lat}-${location.lng}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{location.location}</div>
                          <div className="text-sm text-gray-500">
                            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">{location.activities}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Heatmap Tab */}
        {activeTab === 'heatmap' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Activity Heatmap</h2>
            
            {/* Placeholder for map - in real app, this would be a map component */}
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <GlobeAltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h3>
                <p className="text-gray-500 mb-4">Location-based activity heatmap would display here</p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm">
                  {heatmapData.slice(0, 4).map((point, index) => (
                    <div key={index} className="bg-white p-3 rounded border text-left">
                      <div className="font-medium">{point.location}</div>
                      <div className="text-gray-600">{point.activities} activities</div>
                      <div className="text-xs text-gray-500">
                        Intensity: {(point.intensity * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Legend */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Activity Intensity:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-200 rounded"></div>
                  <span className="text-xs text-gray-600">Low</span>
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-xs text-gray-600">Medium</span>
                  <div className="w-4 h-4 bg-blue-800 rounded"></div>
                  <span className="text-xs text-gray-600">High</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {heatmapData.length} active locations
              </div>
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Activity Log</h2>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-64 rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  
                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Activities</option>
                    <option value="safe_id_share">Safe ID Shares</option>
                    <option value="campaign_view">Campaign Views</option>
                    <option value="offer_redeem">Offer Redemptions</option>
                    <option value="incident_report">Incident Reports</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time & Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredActivities.map((activity) => {
                    const ActivityIcon = getActivityTypeIcon(activity.activityType);
                    return (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {activity.timestamp.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {activity.address}, {activity.city}, {activity.state}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <ActivityIcon className="h-5 w-5 text-gray-400" />
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActivityTypeColor(activity.activityType)}`}>
                              {activity.activityType.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{activity.userName}</div>
                            <div className="text-sm text-gray-500">{activity.userType.replace('_', ' ')}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {JSON.stringify(activity.details, null, 2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-8">
                <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Time-based Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Hourly Activity Distribution</h2>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <div className="text-center">
                    <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Hourly activity chart would display here</p>
                    <p className="text-sm text-gray-400 mt-2">Peak hour: {stats.peakActivityHour}:00</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Geographic Distribution</h2>
                <div className="space-y-3">
                  {['IL', 'TX', 'CA', 'NY', 'AZ'].map((state, index) => {
                    const stateActivities = activities.filter(a => a.state === state).length;
                    const percentage = activities.length > 0 ? (stateActivities / activities.length * 100) : 0;
                    
                    return (
                      <div key={state} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{state}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{stateActivities}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Performance Metrics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.averageActivityPerLocation.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Avg Activities per Location</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.uniqueLocations}</div>
                  <div className="text-sm text-gray-500">Active Locations</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.totalActivities}</div>
                  <div className="text-sm text-gray-500">Total Activities</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{stats.peakActivityHour}:00</div>
                  <div className="text-sm text-gray-500">Peak Activity Hour</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
} 