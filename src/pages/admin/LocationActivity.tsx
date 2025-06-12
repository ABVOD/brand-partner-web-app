import  { useState, useMemo } from 'react';
import {
  MapPinIcon,
  ClockIcon,
  ChartBarIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  TagIcon,
  ArrowDownTrayIcon,
  GlobeAltIcon,
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
      case 'safe_id_share':
        return 'bg-green-900/50 text-green-300';
      case 'campaign_view':
        return 'bg-blue-900/50 text-blue-300';
      case 'offer_redeem':
        return 'bg-purple-900/50 text-purple-300';
      case 'incident_report':
        return 'bg-red-900/50 text-red-300';
      case 'insurance_check':
        return 'bg-orange-900/50 text-orange-300';
      default:
        return 'bg-gray-600/50 text-gray-300';
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'safe_id_share':
        return IdentificationIcon;
      case 'campaign_view':
        return EyeIcon;
      case 'offer_redeem':
        return TagIcon;
      case 'incident_report':
        return ExclamationTriangleIcon;
      case 'insurance_check':
        return BuildingOfficeIcon;
      default:
        return MapPinIcon;
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Location Activity</h1>
            <p className="text-gray-400 mt-1">Monitor user activities across different locations</p>
          </div>
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export Data</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'heatmap', label: 'Heatmap', icon: GlobeAltIcon },
              { id: 'activities', label: 'Activity Log', icon: ClockIcon },
              { id: 'analytics', label: 'Analytics', icon: ArrowTrendingUpIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
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
            {/* Time Range Filter */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-100">Time Range</h3>
                <div className="flex space-x-2">
                  {(['24h', '7d', '30d', '90d'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        timeRange === range
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-900/50 rounded-lg">
                    <MapPinIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">{stats.totalActivities}</p>
                    <p className="text-sm text-gray-400">Total Activities</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-900/50 rounded-lg">
                    <GlobeAltIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">{stats.uniqueLocations}</p>
                    <p className="text-sm text-gray-400">Unique Locations</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-900/50 rounded-lg">
                    <IdentificationIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">{stats.safeIdShares}</p>
                    <p className="text-sm text-gray-400">Safe ID Shares</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-900/50 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">{stats.peakActivityHour}:00</p>
                    <p className="text-sm text-gray-400">Peak Hour</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Activity Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-900/50 rounded-lg">
                        <IdentificationIcon className="h-4 w-4 text-green-400" />
                      </div>
                      <span className="text-sm text-gray-300">Safe ID Shares</span>
                    </div>
                    <span className="text-sm font-medium text-gray-100">{stats.safeIdShares}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-900/50 rounded-lg">
                        <EyeIcon className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="text-sm text-gray-300">Campaign Views</span>
                    </div>
                    <span className="text-sm font-medium text-gray-100">{stats.campaignViews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-900/50 rounded-lg">
                        <TagIcon className="h-4 w-4 text-purple-400" />
                      </div>
                      <span className="text-sm text-gray-300">Offer Redemptions</span>
                    </div>
                    <span className="text-sm font-medium text-gray-100">{stats.offerRedemptions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-900/50 rounded-lg">
                        <ExclamationTriangleIcon className="h-4 w-4 text-red-400" />
                      </div>
                      <span className="text-sm text-gray-300">Incident Reports</span>
                    </div>
                    <span className="text-sm font-medium text-gray-100">{stats.incidentReports}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Top Locations</h3>
                <div className="space-y-4">
                  {heatmapData.slice(0, 5).map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-900/50 rounded-lg">
                          <MapPinIcon className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="text-sm text-gray-300">{location.location}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-100">{location.activities}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Heatmap Tab */}
        {activeTab === 'heatmap' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Activity Type</label>
                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Activities</option>
                    <option value="safe_id_share">Safe ID Shares</option>
                    <option value="campaign_view">Campaign Views</option>
                    <option value="offer_redeem">Offer Redemptions</option>
                    <option value="incident_report">Incident Reports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Locations</option>
                    {heatmapData.map((location, index) => (
                      <option key={index} value={location.location}>
                        {location.location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Heatmap Visualization */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Activity Heatmap</h3>
              <div className="bg-gray-700 rounded-lg p-8 text-center">
                <GlobeAltIcon className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                <p className="text-gray-400">Interactive map visualization would be implemented here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Integration with mapping services like Google Maps or Mapbox
                </p>
              </div>
            </div>

            {/* Heatmap Data Table */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-gray-100">Location Data</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Coordinates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Activities
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Intensity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {heatmapData.map((location, index) => (
                      <tr key={index} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-100">{location.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                          {location.activities}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${(location.intensity / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-300">{location.intensity}/10</span>
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

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Activities</option>
                    <option value="safe_id_share">Safe ID Shares</option>
                    <option value="campaign_view">Campaign Views</option>
                    <option value="offer_redeem">Offer Redemptions</option>
                    <option value="incident_report">Incident Reports</option>
                    <option value="insurance_check">Insurance Checks</option>
                  </select>
                </div>
                <div>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
                </div>
                <div>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Locations</option>
                    {Array.from(new Set(activities.map(a => a.city))).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Activities Table */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-gray-100">Activity Log</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {activities
                      .filter(activity => {
                        if (activityFilter !== 'all' && activity.activityType !== activityFilter) return false;
                        if (selectedLocation && activity.city !== selectedLocation) return false;
                        if (searchQuery && !activity.userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
                            !activity.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                        return true;
                      })
                      .map((activity) => {
                        const ActivityIcon = getActivityTypeIcon(activity.activityType);
                        return (
                          <tr key={activity.id} className="hover:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="p-2 bg-purple-900/50 rounded-lg mr-3">
                                  <ActivityIcon className="h-4 w-4 text-purple-400" />
                                </div>
                                <div>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityTypeColor(activity.activityType)}`}>
                                    {activity.activityType.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-100">{activity.userName}</div>
                                <div className="text-sm text-gray-400">{activity.userType.replace('_', ' ')}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm text-gray-100">{activity.address}</div>
                                <div className="text-sm text-gray-400">{activity.city}, {activity.state}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm text-gray-100">{activity.timestamp.toLocaleDateString()}</div>
                                <div className="text-sm text-gray-400">{activity.timestamp.toLocaleTimeString()}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Activity Trends</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Average per Location</span>
                    <span className="text-sm font-medium text-gray-100">
                      {stats.averageActivityPerLocation.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Peak Activity Hour</span>
                    <span className="text-sm font-medium text-gray-100">{stats.peakActivityHour}:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Most Active Type</span>
                    <span className="text-sm font-medium text-gray-100">Safe ID Shares</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Geographic Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total Cities</span>
                    <span className="text-sm font-medium text-gray-100">
                      {Array.from(new Set(activities.map(a => a.city))).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total States</span>
                    <span className="text-sm font-medium text-gray-100">
                      {Array.from(new Set(activities.map(a => a.state))).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Coverage Area</span>
                    <span className="text-sm font-medium text-gray-100">National</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">User Engagement</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Active Users</span>
                    <span className="text-sm font-medium text-gray-100">
                      {Array.from(new Set(activities.map(a => a.userId))).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Repeat Users</span>
                    <span className="text-sm font-medium text-gray-100">73%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Avg. Activities/User</span>
                    <span className="text-sm font-medium text-gray-100">2.3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Activity Timeline</h3>
                <div className="bg-gray-700 rounded-lg p-8 text-center">
                  <ChartBarIcon className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                  <p className="text-gray-400">Timeline chart would be implemented here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Showing activity patterns over time
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Geographic Insights</h3>
                <div className="bg-gray-700 rounded-lg p-8 text-center">
                  <GlobeAltIcon className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                  <p className="text-gray-400">Geographic analysis chart would be implemented here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Regional activity distribution and trends
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
} 